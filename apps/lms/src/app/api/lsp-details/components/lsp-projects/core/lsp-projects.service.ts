import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspProjectDto, LspProject } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspProjectsService extends CrudHelper<LspProject> {
  constructor(private readonly crudService: CrudService<LspProject>) {
    super(crudService);
  }

  async addLspProjects(lspProjectDto: CreateLspProjectDto, entityManager: EntityManager) {
    const lspProject = await this.crudService.transact<LspProject>(entityManager).create({
      dto: lspProjectDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { lspDetails, ...rest } = lspProject;
    return rest;
  }

  async deleteAllLspProjectsByLspDetailsIdTransaction(lspDetailsId: string, entityManager: EntityManager) {
    const deleteResult = await this.crudService.transact<LspProject>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    return deleteResult;
  }
}
