import { CrudService } from '@gscwd-api/crud';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TrainingDetailsTestView } from '../data/training-details-test.view';

@Injectable()
export class TrainingDetailsTestService {
  constructor(private readonly crudService: CrudService<TrainingDetailsTestView>) {}

  async findAll(page: number, limit: number) {
    return await this.crudService.findAll({
      find: {
        select: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          id: true,
          courseTitle: true,
          location: true,
          trainingStart: true,
          trainingEnd: true,
          status: true,
          lspType: true,
        },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  async findById(id: string) {
    return await this.crudService.findAll({
      find: {
        where: { id: id },
      },
      onError: () => new BadRequestException(),
    });
  }
}
