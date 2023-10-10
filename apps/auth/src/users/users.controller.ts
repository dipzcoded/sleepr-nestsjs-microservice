import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dtos';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards';
import { UserDocument } from '../models/user.schema';
import { CurrentUser } from '@app/common';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post('/')
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getUser(@CurrentUser() user: UserDocument) {
    return user;
  }
}
