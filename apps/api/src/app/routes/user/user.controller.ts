import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  FindUserDto,
  CreateUserDto,
  UpdateUserDto,
  IdParamsDto,
} from '@unsold-food-deals/schemas';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async find(@Query() payload: FindUserDto) {
    return this.userService.retrieveBy(payload);
  }

  @Post()
  async create(@Body() payload: CreateUserDto) {
    return this.userService.create(payload);
  }

  @Patch(':id')
  async update(@Param() { id }: IdParamsDto, @Body() payload: UpdateUserDto) {
    return this.userService.update(id, payload);
  }
}
