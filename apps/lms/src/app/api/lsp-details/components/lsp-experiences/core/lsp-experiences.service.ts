import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspExperienceDto, LspExperience } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspExperiencesService extends CrudHelper<LspExperience> {
  constructor(private readonly crudService: CrudService<LspExperience>) {
    super(crudService);
  }

  async addLspExperiences(lspExperienceDto: CreateLspExperienceDto, entityManager: EntityManager) {
    const lspExperience = await this.crudService.transact<LspExperience>(entityManager).create({
      dto: lspExperienceDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { lspDetails, ...rest } = lspExperience;
    return rest;
  }

  async deleteAllLspExperiencesByLspDetailsIdTransaction(lspDetailsId: string, entityManager: EntityManager) {
    const deleteResult = await this.crudService.transact<LspExperience>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    return deleteResult;
  }
}
