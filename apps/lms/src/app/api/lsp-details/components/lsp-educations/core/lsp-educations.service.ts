import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspEducationDto, LspEducation } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspEducationsService extends CrudHelper<LspEducation> {
  constructor(private readonly crudService: CrudService<LspEducation>) {
    super(crudService);
  }

  async addLspEducations(lspEducationDto: CreateLspEducationDto, entityManager: EntityManager) {
    const lspEducation = await this.crudService.transact<LspEducation>(entityManager).create({
      dto: lspEducationDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { lspDetails, ...rest } = lspEducation;
    return rest;
  }

  async deleteAllLspEducationsByLspDetailsIdTransaction(lspDetailsId: string, entityManager: EntityManager) {
    const deleteResult = await this.crudService.transact<LspEducation>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    return deleteResult;
  }
}
