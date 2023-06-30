import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspOrganizationProjectDto, LspOrganizationProject } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspOrganizationProjectsService extends CrudHelper<LspOrganizationProject> {
  constructor(private readonly crudService: CrudService<LspOrganizationProject>) {
    super(crudService);
  }

  //insert learning service provider organization project
  async addProjects(data: CreateLspOrganizationProjectDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationProject>(entityManager).create({
      dto: data,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //decostruct and return result
    const { lspOrganizationDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider organization project
  async deleteProjects(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationProject>(entityManager).delete({
      deleteBy: { lspOrganizationDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //return result
    return result;
  }
}
