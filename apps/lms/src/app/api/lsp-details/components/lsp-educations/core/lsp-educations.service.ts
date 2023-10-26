import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspEducationDto, LspEducation } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspEducationsService extends CrudHelper<LspEducation> {
  constructor(private readonly crudService: CrudService<LspEducation>) {
    super(crudService);
  }

  // insert learning service provider education
  async create(data: CreateLspEducationDto, entityManager: EntityManager) {
    // transaction result
    const result = await this.crudService.transact<LspEducation>(entityManager).create({
      dto: data,
      onError: (error) => {
        throw error;
      },
    });

    // return result
    return result;
  }

  // delete learning service provider education by lsp details id
  async delete(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspEducation>(entityManager).delete({
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
