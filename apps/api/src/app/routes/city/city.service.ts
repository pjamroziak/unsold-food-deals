import { EntityRepository, wrap } from '@mikro-orm/core';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { City } from '../../entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { parsePaginated } from '../../utils';
import { Cache } from 'cache-manager';
import {
  CordinatesDto,
  CreateCityDto,
  FindCityDto,
  UpdateCityDto,
} from '@unsold-food-deals/schemas';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CityService {
  private readonly logger = new Logger(CityService.name);

  constructor(
    @InjectRepository(City)
    private readonly cityRepository: EntityRepository<City>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async retrieveBy(payload: FindCityDto) {
    const { limit, offset, ...query } = payload;
    const result = await this.cityRepository.findAndCount(query, {
      offset,
      limit,
    });

    return parsePaginated(result);
  }

  async findClosest(cordinates: CordinatesDto) {
    let cities = await this.cacheManager.get<City[]>('available-cities');

    if (!cities) {
      this.logger.debug('Cache "available-cities" is empty, refreshing');
      cities = await this.cityRepository.findAll({
        fields: ['id', 'name', 'latitude', 'longitude', 'radiusInKm'],
      });
      this.cacheManager.set('available-cities', cities, 36000);
    }

    if (cities.length === 0) {
      this.logger.warn(
        {
          cordinates,
        },
        'Database return empty list of available cities'
      );
      throw new NotFoundException('List of available cities is empty');
    }

    const mappedDistances = cities.map((city) => {
      const cityCordinates: CordinatesDto = {
        longitude: city.longitude,
        latitude: city.latitude,
      };

      return {
        city,
        distance: this.getDistanceBetweenCordinates(cordinates, cityCordinates),
      };
    });

    const closestDistanceCity = mappedDistances.reduce((prev, curr) => {
      return prev.distance <= curr.distance ? prev : curr;
    });

    const isClosestCityInRange =
      closestDistanceCity.distance - closestDistanceCity.city.radiusInKm > 0;

    if (isClosestCityInRange) {
      throw new NotFoundException(
        'Based on provided cordinates, cannot find any city'
      );
    }

    return closestDistanceCity.city;
  }

  async create(payload: CreateCityDto) {
    const newCity = this.cityRepository.create(payload);
    await this.cityRepository.persistAndFlush(newCity);

    return newCity;
  }

  async update(id: string, payload: UpdateCityDto) {
    const oldCity = await this.cityRepository.findOne(id);

    if (!oldCity) {
      throw new NotFoundException(
        'City not found',
        `Cannot find city by ID - ${id}`
      );
    }

    try {
      await this.cityRepository.persistAndFlush(wrap(oldCity).assign(payload));
    } catch (error) {
      this.logger.error({ id, payload, error }, 'Updating City failed');
      throw new InternalServerErrorException(error);
    }
  }

  private getDistanceBetweenCordinates(
    userCords: CordinatesDto,
    cityCords: CordinatesDto
  ) {
    const isLatitudeEqual = userCords.latitude === cityCords.latitude;
    const isLongitudeEqual = cityCords.longitude === cityCords.longitude;
    const isCordinatesEqual = isLatitudeEqual && isLongitudeEqual;

    if (isCordinatesEqual) {
      return 0;
    }

    const userRadLatitude = (Math.PI * userCords.latitude) / 180;
    const locationRadLatitude = (Math.PI * cityCords.latitude) / 180;

    const theta = userCords.longitude - cityCords.longitude;
    const radtheta = (Math.PI * theta) / 180;

    let distance =
      Math.sin(userRadLatitude) * Math.sin(locationRadLatitude) +
      Math.cos(userRadLatitude) *
        Math.cos(locationRadLatitude) *
        Math.cos(radtheta);

    if (distance > 1) {
      distance = 1;
    }

    distance = (Math.acos(distance) * 180) / Math.PI;
    const miles = distance * 60 * 1.1515;
    const kilometers = miles * 1.609344;

    return kilometers;
  }
}
