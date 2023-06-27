import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingTagDto, TrainingTag } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingTagsService extends CrudHelper<TrainingTag> {
  constructor(private readonly crudService: CrudService<TrainingTag>) {
    super(crudService);
  }

  //HR insert training tag
  async addTrainingTag(dto: CreateTrainingTagDto, entityManager: EntityManager) {
    //transaction results
    const results = await this.crudService.transact<TrainingTag>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { training, ...rest } = results;
    return rest;
  }
}
