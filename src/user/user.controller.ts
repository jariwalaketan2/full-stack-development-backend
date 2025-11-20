import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UserService } from './user.service';

@Controller()
@UseGuards(ThrottlerGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Post('users')
  createUser(@Body() userData: { name: string; email: string }) {
    return this.userService.createUser(userData);
  }

  @Delete('cache')
  clearCache() {
    return this.userService.clearCache();
  }

  @Get('cache-status')
  getCacheStatus() {
    return this.userService.getCacheStatus();
  }
}