import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { CityService } from './city.service';
import { FindClosestCityDto } from './dto/find-closest-city.dto';

@Controller({
  path: 'cities',
  version: '1',
})
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async getAll() {
    return this.cityService.findAll();
  }

  @Get('names')
  async getCititesNames() {
    return this.cityService.findAllCitiesNames();
  }

  @Get(':id')
  async getBydId(@Param('id') id: number) {
    return this.cityService.findById(id);
  }

  @Post()
  async create(@Body() body: CreateCityDto) {
    return this.cityService.create(body);
  }

  @Post('/find')
  async findClosestCity(@Body() body: FindClosestCityDto) {
    return this.cityService.findClosestCity(body);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.cityService.remove(id);
  }
}
