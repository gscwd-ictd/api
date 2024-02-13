import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
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
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('lnd/assignable')
  async findAssignableUsers() {
    try {
      return await this.hrmsUsersService.findAssignableLndUsers();
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
