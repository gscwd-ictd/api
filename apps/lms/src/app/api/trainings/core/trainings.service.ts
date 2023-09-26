import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingExternalDto, CreateTrainingInternalDto, Training } from '@gscwd-api/models';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class TrainingsService extends CrudHelper<Training> {
  constructor(private readonly crudService: CrudService<Training>) {
    super(crudService);
  }

  async addTrainingInternal(data: CreateTrainingInternalDto) {
    const training = await this.crudService.create({
      dto: data,
      onError: () => new BadRequestException(),
    });

    return training;
  }

  async addTrainingExternal(data: CreateTrainingExternalDto) {
    const training = await this.crudService.create({
      dto: data,
      onError: () => new BadRequestException(),
    });
  }
}
