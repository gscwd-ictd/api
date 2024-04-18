import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOtherTrainingDto, OtherTraining } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class OtherTrainingsService extends CrudHelper<OtherTraining> {
  constructor(private readonly crudService: CrudService<OtherTraining>, private readonly dataSource: DataSource) {
    super(crudService);
  }

  /* insert other trainings */
  async createOtherTrainings(data: CreateOtherTrainingDto) {
    return data;
  }
}
