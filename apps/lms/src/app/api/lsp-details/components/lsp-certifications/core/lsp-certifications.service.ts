import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspCertificationDto, LspCertification } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspCertificationsService extends CrudHelper<LspCertification> {
  constructor(private readonly crudService: CrudService<LspCertification>) {
    super(crudService);
  }

  //insert learning service provider certifications
  async create(data: CreateLspCertificationDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspCertification>(entityManager).create({
      dto: data,
      onError: (error) => {
        throw error;
      },
    });

    // return result
    return result;
  }

  //delete learning service provider certifications by lsp details id
  async delete(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspCertification>(entityManager).delete({
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
