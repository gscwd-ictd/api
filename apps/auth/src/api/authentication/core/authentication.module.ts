import { PasswordModule } from '@gscwd-api/password';
import { Module } from '@nestjs/common';
import { UserModule } from '../../user';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    PasswordModule.register({
      secret: Buffer.from(process.env.PASSWORD_KEY),
      saltLength: 50,
      hashLength: 100,
      parallelism: 4,
    }),

    UserModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
