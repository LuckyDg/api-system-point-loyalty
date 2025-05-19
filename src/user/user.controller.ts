import { Controller, Get, Post, Body, } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body('name') name: string) {
    return this.userService.create(name);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
