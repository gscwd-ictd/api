import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { HrmsUsersService } from './users.service';
import { CreateUserDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'hrms' })
export class HrmsUsersController {
  constructor(private readonly hrmsUsersService: HrmsUsersService) {}

  // find hrms users by app
  @Get('lnd')
  async findLndUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    try {
      return await this.hrmsUsersService.findLndUsers(page, limit);
    } catch (error) {
      Logger.log(error);
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
  async createLndUsers(@Body() data: CreateUserDto) {
    try {
      return await this.hrmsUsersService.createLndUsers(data);
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
