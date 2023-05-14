import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CityService } from './city.service';
import {
  CordinatesDto,
  CreateCityDto,
  FindCityDto,
  IdParamsDto,
  UpdateCityDto,
} from '@unsold-food-deals/schemas';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async find(@Query() payload: FindCityDto) {
    return this.cityService.retrieveBy(payload);
  }

  @Post()
  async create(@Body() payload: CreateCityDto) {
    return this.cityService.create(payload);
  }

  @Post('closest')
  async findClosest(@Body() payload: CordinatesDto) {
    return this.cityService.findClosest(payload);
  }

  @Patch(':id')
  async update(@Param() { id }: IdParamsDto, @Body() payload: UpdateCityDto) {
    return this.cityService.update(id, payload);
  }
}
