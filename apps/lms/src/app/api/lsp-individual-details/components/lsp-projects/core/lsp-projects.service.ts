import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspProjectDto, LspProject } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspProjectsService extends CrudHelper<LspProject> {
  constructor(private readonly crudService: CrudService<LspProject>) {
    super(crudService);
  }

  //insert learning service provider project
  async addProjects(lspProjectDto: CreateLspProjectDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspProject>(entityManager).create({
      dto: lspProjectDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //decostruct and return result
    const { lspDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider project
  async deleteProjects(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspProject>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //return result
    return result;
  }
}
