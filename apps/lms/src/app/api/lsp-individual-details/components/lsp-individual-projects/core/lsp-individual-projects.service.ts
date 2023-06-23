import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspIndividualProjectDto, LspIndividualProject } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspIndividualProjectsService extends CrudHelper<LspIndividualProject> {
  constructor(private readonly crudService: CrudService<LspIndividualProject>) {
    super(crudService);
  }

  //insert learning service provider project
  async addProjects(dto: CreateLspIndividualProjectDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualProject>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //decostruct and return result
    const { lspIndividualDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider project
  async deleteProjects(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualProject>(entityManager).delete({
      deleteBy: { lspIndividualDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //return result
    return result;
  }
}
