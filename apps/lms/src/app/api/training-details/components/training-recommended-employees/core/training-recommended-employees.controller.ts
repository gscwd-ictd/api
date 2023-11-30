import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { TrainingRecommendedEmployeeService } from './training-recommended-employees.service';

@Controller({ version: '1', path: 'training-recommended-employees' })
export class TrainingRecommendedEmployeesController {
  constructor(private readonly trainingRecommendedEmployeeService: TrainingRecommendedEmployeeService) {}

  @Get(':id')
  async findAllByDistributionId(@Param('id') distributionId: string) {
    try {
      return await this.trainingRecommendedEmployeeService.findAllByDistributionId(distributionId);
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
