import { Controller, Get } from '@nestjs/common';
import { EmsSettingsService } from './ems-settings.service';

@Controller({ version: '1', path: 'ems-settings' })
export class EmsSettingsController {
  constructor(private readonly emsSettingsService: EmsSettingsService) {}

  @Get('/monetization')
  async getMonetizationConstant() {
    return await this.emsSettingsService.getMonetizationConstant();
  }
}
