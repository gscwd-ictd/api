import { Credentials, RegistrationDetails } from '@gscwd-api/utils';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthenticatedUserInterceptor, RegisteredUserInterceptor } from '../misc/auth.interceptor';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @UseInterceptors(RegisteredUserInterceptor)
  @Post('web/register')
  async register(@Body() details: RegistrationDetails) {
    return await this.authService.createUser(details);
  }

  @UseInterceptors(AuthenticatedUserInterceptor)
  @Post('web/login')
  async login(@Body() credentials: Credentials) {
    return await this.authService.authenticate(credentials);
  }
}
