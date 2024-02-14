import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { HrmsUsersService } from './users.service';

@Controller({ version: '1', path: 'hrms' })
export class HrmsUsersController {
  constructor(private readonly hrmsUsersService: HrmsUsersService) {}

  // find hrms users by app
  @Get('lnd')
  async findLndUsers() {
    try {
      return await this.hrmsUsersService.findLndUsers();
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('lnd/assignable')
  async findAssignableUsers() {
    try {
      return await this.hrmsUsersService.findAssignableLndUsers();
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('lnd')
  async createLndUsers() {
    try {
      return await this.hrmsUsersService.createLndUsers();
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('lnd/:id')
  async removeLndUsers(@Param('id') id: string) {
    try {
      return await this.hrmsUsersService.removeLndUsers(id);
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
