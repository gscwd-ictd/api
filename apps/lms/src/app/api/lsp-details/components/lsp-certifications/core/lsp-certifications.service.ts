import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspCertificationDto, LspCertification } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspCertificationsService extends CrudHelper<LspCertification> {
  constructor(private readonly crudService: CrudService<LspCertification>) {
    super(crudService);
  }

  // insert learning service provider certifications
  async create(data: CreateLspCertificationDto, entityManager: EntityManager) {
    return await this.crudService.transact<LspCertification>(entityManager).create({
      dto: data,
      onError: (error) => {
        throw error;
      },
    });
  }

  // remove learning service provider certifications by lsp details id
  async remove(lspDetailsId: string, softDelete: boolean, entityManager: EntityManager) {
    return await this.crudService.transact<LspCertification>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: softDelete,
      onError: (error) => {
        throw error;
      },
    });
  }
}
