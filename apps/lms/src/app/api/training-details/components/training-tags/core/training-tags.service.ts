import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingTagDto, TrainingTag } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingTagsService extends CrudHelper<TrainingTag> {
  constructor(private readonly crudService: CrudService<TrainingTag>) {
    super(crudService);
  }

  //insert training tag
  async create(data: CreateTrainingTagDto, entityManager: EntityManager) {
    const { id, ...rest } = data;
    //transaction results
    return await this.crudService.transact<TrainingTag>(entityManager).create({
      dto: { tag: id, ...rest },
      onError: (error) => {
        throw error;
      },
    });
  }

  async findAllByTrainingId(trainingId: string) {
    try {
      const tag = (await this.crudService.findAll({
        find: { relations: { tag: true }, select: { id: true, tag: { id: true, name: true } }, where: { trainingDetails: { id: trainingId } } },
      })) as Array<TrainingTag>;

      return await Promise.all(
        tag.map(async (tagItem) => {
          return {
            id: tagItem.tag.id,
            name: tagItem.tag.name,
          };
        })
      );
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string, softDelete: boolean, entityManager: EntityManager) {
    return await this.crudService.transact<TrainingTag>(entityManager).delete({
      deleteBy: { trainingDetails: { id } },
      softDelete: softDelete,
      onError: (error) => {
        throw error;
      },
    });
  }
}
