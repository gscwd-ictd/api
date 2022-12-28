import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CrudModule } from '@gscwd-api/crud';
import { User } from '../data/user.entity';

@Module({
  imports: [CrudModule.register(User)],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
