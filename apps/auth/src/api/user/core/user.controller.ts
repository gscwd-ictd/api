import { Controller, Get, NotFoundException, Param, UseInterceptors } from '@nestjs/common';
import { UserInterceptor } from '../misc/user.interceptors';
import { UserService } from './user.service';

@UseInterceptors(UserInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAllUsers() {
    return await this.userService.crud().findAll({});
  }

  @Get(':id')
  async findUserById(@Param('id') userId: string) {
    return await this.userService.crud().findOneBy({ userId }, () => new NotFoundException());
  }
}
