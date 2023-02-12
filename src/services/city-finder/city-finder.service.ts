import { Cordinates } from '@app/common/types';
import { City } from '@app/entities/city.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CityFinderService {
  async findClosestCity(cities: City[], cordinates: Cordinates) {
    if (cities.length === 0) {
      return null;
    }

    const mappedDistances = cities.map((city) => {
      const cityCordinates: Cordinates = {
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
      closestDistanceCity.distance - closestDistanceCity.city.radius > 0;

    if (isClosestCityInRange) {
      return null;
    }

    return closestDistanceCity.city;
  }

  private getDistanceBetweenCordinates(uCords: Cordinates, cCords: Cordinates) {
    const isLatitudeEqual = uCords.latitude === cCords.latitude;
    const isLongitudeEqual = cCords.longitude === cCords.longitude;
    const isCordinatesEqual = isLatitudeEqual && isLongitudeEqual;

    if (isCordinatesEqual) {
      return 0;
    }

    const userRadLatitude = (Math.PI * uCords.latitude) / 180;
    const locationRadLatitude = (Math.PI * cCords.latitude) / 180;

    const theta = uCords.longitude - cCords.longitude;
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
