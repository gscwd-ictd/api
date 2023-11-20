import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingLspDetailsDto, TrainingLspDetails } from '@gscwd-api/models';
import { LspDetailsRaw } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LspDetailsService } from '../../../../lsp-details';

@Injectable()
export class TrainingLspDetailsService extends CrudHelper<TrainingLspDetails> {
  constructor(private readonly crudService: CrudService<TrainingLspDetails>, private readonly lspDetailsService: LspDetailsService) {
    super(crudService);
  }

  //insert training lsp details
  async create(data: CreateTrainingLspDetailsDto, entityManager: EntityManager) {
    const { id, ...rest } = data;
    //transaction results
    const results = await this.crudService.transact<TrainingLspDetails>(entityManager).create({
      dto: { lspDetails: id, ...rest },
      onError: (error) => {
        throw error;
      },
    });
    return results;
  }

  async findAllByTrainingId(trainingId: string) {
    try {
      const lspDetails = (await this.crudService.findAll({
        find: { relations: { lspDetails: true }, select: { lspDetails: { id: true } }, where: { trainingDetails: { id: trainingId } } },
      })) as Array<TrainingLspDetails>;

      return await Promise.all(
        lspDetails.map(async (lspDetailsItem) => {
          const lsp = (await this.lspDetailsService.findLspById(lspDetailsItem.lspDetails.id)) as LspDetailsRaw;
          return {
            id: lsp.id,
            name: lsp.name,
            email: lsp.email,
            type: lsp.type,
            source: lsp.source,
          };
        })
      );
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async remove(trainingId: string, softDelete: boolean, entityManager: EntityManager) {
    return await this.crudService.transact<TrainingLspDetails>(entityManager).delete({
      deleteBy: { trainingDetails: { id: trainingId } },
      softDelete: softDelete,
      onError: (error) => {
        throw error;
      },
    });
  }
}
