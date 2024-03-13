import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspProjectDto, LspProject } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspProjectsService extends CrudHelper<LspProject> {
  constructor(private readonly crudService: CrudService<LspProject>) {
    super(crudService);
  }

  /* find all projects by learning service provider id */
  async findAllProjectsByLspId(lspDetailsId: string) {
    try {
      return await this.crudService.findAll({
        find: {
          select: {
            name: true,
          },
          where: {
            lspDetails: { id: lspDetailsId },
          },
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  /* insert learning service provider project */
  async createProjects(data: CreateLspProjectDto, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspProject>(entityManager).create({
        dto: data,
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* remove project by learning service provider id */
  async deleteProjectsByLspId(lspDetailsId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<LspProject>(entityManager).delete({
        deleteBy: {
          lspDetails: { id: lspDetailsId },
        },
        softDelete: false,
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
