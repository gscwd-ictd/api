import { Controller, Get } from '@nestjs/common';
import { OfficerOfTheDayService } from './officer-of-the-day.service';

@Controller('officer-of-the-day')
export class OfficerOfTheDayController {
  constructor(private readonly officerOfTheDayService: OfficerOfTheDayService) {}

  @Get()
  async findAll() {
    return await this.officerOfTheDayService.getAll();
  }
}
