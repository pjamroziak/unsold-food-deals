import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { UserService } from './user.service';

@Controller({
  path: 'users',
  version: '1',
})
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  async get(@Param('userId') userId: number) {
    return this.userService.getBy({ id: userId });
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch(':userId/settings')
  async updateSettings(
    @Param('userId') userId: number,
    @Body() dto: UpdateUserSettingsDto,
  ) {
    return this.userService.updateSettings(userId, dto);
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: number) {
    return this.userService.remove(userId);
  }
}
