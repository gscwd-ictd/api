import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspProjectDto, LspProject } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspProjectsService extends CrudHelper<LspProject> {
  constructor(private readonly crudService: CrudService<LspProject>) {
    super(crudService);
  }

  // insert learning service provider project
  async create(data: CreateLspProjectDto, entityManager: EntityManager) {
    // transaction result
    const result = await this.crudService.transact<LspProject>(entityManager).create({
      dto: data,
      onError: (error) => {
        throw error;
      },
    });

    // return result
    return result;
  }

  // delete learning service provider project by lsp details id
  async delete(lspDetailsId: string, entityManager: EntityManager) {
    // transaction result
    const result = await this.crudService.transact<LspProject>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: (error) => {
        throw error;
      },
    });

    // return result
    return result;
  }
}
