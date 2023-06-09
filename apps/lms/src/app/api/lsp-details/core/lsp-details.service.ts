import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspDetailsDto, LspDetails, UpdateLspDetailsDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { LspAffiliationsService } from '../components/lsp-affiliations';
import { LspAwardsService } from '../components/lsp-awards';
import { LspCertificationsService } from '../components/lsp-certifications';
import { LspCoachingsService } from '../components/lsp-coachings';
import { LspEducationsService } from '../components/lsp-educations';
import { LspProjectsService } from '../components/lsp-projects';
import { LspTrainingsService } from '../components/lsp-trainings';
import { Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class LspDetailsService extends CrudHelper<LspDetails> {
  constructor(
    private readonly crudService: CrudService<LspDetails>,
    private readonly lspAffiliationsService: LspAffiliationsService,
    private readonly lspAwardsService: LspAwardsService,
    private readonly lspCertificationService: LspCertificationsService,
    private readonly lspCoachingsService: LspCoachingsService,
    private readonly lspEducationsService: LspEducationsService,
    private readonly lspProjectsService: LspProjectsService,
    private readonly lspTrainingsService: LspTrainingsService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  async findAllLspDetails(page: number, limit: number): Promise<Pagination<LspDetails> | LspDetails[]> {
    return await this.crud().findAll({
      find: {
        relations: { trainingSource: true },
        select: {
          id: true,
          employeeId: true,
          firstName: true,
          middleName: true,
          lastName: true,
          contactNumber: true,
          email: true,
          postalAddress: true,
          photoUrl: true,
          trainingSource: {
            name: true,
          },
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  async addLspDetails(lspDetailsDto: CreateLspDetailsDto) {
    try {
      const lspDetails = await this.datasource.transaction(async (entityManager) => {
        const { expertise, affiliations, awards, certifications, coaching, education, projects, trainings, ...rest } = lspDetailsDto;

        const newLspDetails = await this.crudService.transact<LspDetails>(entityManager).create({
          dto: { ...rest, expertise: JSON.stringify(expertise) },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        const newLspAffiliation = await Promise.all(
          affiliations.map(async (affiliationItem) => {
            return await this.lspAffiliationsService.addLspAffiliations(
              {
                lspDetails: newLspDetails,
                ...affiliationItem,
              },
              entityManager
            );
          })
        );

        const newLspAward = await Promise.all(
          awards.map(async (awardItem) => {
            return await this.lspAwardsService.addLspAwards(
              {
                lspDetails: newLspDetails,
                ...awardItem,
              },
              entityManager
            );
          })
        );

        const newLspCertification = await Promise.all(
          certifications.map(async (certificationItem) => {
            return await this.lspCertificationService.addLspCertifications(
              {
                lspDetails: newLspDetails,
                ...certificationItem,
              },
              entityManager
            );
          })
        );

        const newLspCoaching = await Promise.all(
          coaching.map(async (coachingItem) => {
            return await this.lspCoachingsService.addLspCoachings(
              {
                lspDetails: newLspDetails,
                ...coachingItem,
              },
              entityManager
            );
          })
        );

        const newLspEducation = await Promise.all(
          education.map(async (educationItem) => {
            return await this.lspEducationsService.addLspEducations(
              {
                lspDetails: newLspDetails,
                ...educationItem,
              },
              entityManager
            );
          })
        );

        const newLspProject = await Promise.all(
          projects.map(async (projectItem) => {
            return await this.lspProjectsService.addLspProjects(
              {
                lspDetails: newLspDetails,
                ...projectItem,
              },
              entityManager
            );
          })
        );

        const newLspTraining = await Promise.all(
          trainings.map(async (trainingItem) => {
            return await this.lspTrainingsService.addLspTrainings(
              {
                lspDetails: newLspDetails,
                ...trainingItem,
              },
              entityManager
            );
          })
        );

        return {
          ...newLspDetails,
          affiliations: newLspAffiliation,
          awards: newLspAward,
          certifications: newLspCertification,
          coaching: newLspCoaching,
          education: newLspEducation,
          projects: newLspProject,
          trainings: newLspTraining,
        };
      });
      return lspDetails;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getLspDetailsById(lspDetailsId: string) {
    try {
      const { expertise, ...rest } = await this.crudService.findOne({
        find: {
          relations: { trainingSource: true },
          where: { id: lspDetailsId },
        },
      });
      const affiliations = await this.lspAffiliationsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const awards = await this.lspAwardsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const certifications = await this.lspCertificationService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const coaching = await this.lspCoachingsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const education = await this.lspEducationsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const projects = await this.lspProjectsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const trainings = await this.lspTrainingsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });

      return {
        ...rest,
        expertise: JSON.parse(expertise),
        affiliations,
        awards,
        certifications,
        coaching,
        education,
        projects,
        trainings,
      };
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async updateLspDetailsById(updateLspDetailsDto: UpdateLspDetailsDto) {
    try {
      const { id, expertise, affiliations, awards, certifications, coaching, education, experience, projects, trainings, ...rest } =
        updateLspDetailsDto;

      const updateLspDetailsResult = await this.datasource.transaction(async (entityManager) => {
        const updateLspDetails = await this.crudService.transact<LspDetails>(entityManager).update({
          dto: { ...rest, expertise: JSON.stringify(expertise) },
          updateBy: { id },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        const deleteAllLspDetailsChild = await this.deleteAllLspDetailsChild(id, entityManager);

        const newLspAffiliation = await Promise.all(
          affiliations.map(async (affiliationItem) => {
            return await this.lspAffiliationsService.addLspAffiliations(
              {
                lspDetails: id,
                ...affiliationItem,
              },
              entityManager
            );
          })
        );

        const newLspAward = await Promise.all(
          awards.map(async (awardItem) => {
            return await this.lspAwardsService.addLspAwards(
              {
                lspDetails: id,
                ...awardItem,
              },
              entityManager
            );
          })
        );

        const newLspCertification = await Promise.all(
          certifications.map(async (certificationItem) => {
            return await this.lspCertificationService.addLspCertifications(
              {
                lspDetails: id,
                ...certificationItem,
              },
              entityManager
            );
          })
        );

        const newLspCoaching = await Promise.all(
          coaching.map(async (coachingItem) => {
            return await this.lspCoachingsService.addLspCoachings(
              {
                lspDetails: id,
                ...coachingItem,
              },
              entityManager
            );
          })
        );

        const newLspEducation = await Promise.all(
          education.map(async (educationItem) => {
            return await this.lspEducationsService.addLspEducations(
              {
                lspDetails: id,
                ...educationItem,
              },
              entityManager
            );
          })
        );

        const newLspProject = await Promise.all(
          projects.map(async (projectItem) => {
            return await this.lspProjectsService.addLspProjects(
              {
                lspDetails: id,
                ...projectItem,
              },
              entityManager
            );
          })
        );

        const newLspTraining = await Promise.all(
          trainings.map(async (trainingItem) => {
            return await this.lspTrainingsService.addLspTrainings(
              {
                lspDetails: id,
                ...trainingItem,
              },
              entityManager
            );
          })
        );

        return updateLspDetails;
      });

      return updateLspDetailsResult;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteLspDetailsById(lspDetailsId: string) {
    try {
      const lspDetails = await this.getLspDetailsById(lspDetailsId);

      const deleteResult = await this.datasource.transaction(async (entityManager) => {
        const deleteAllLspDetailsChild = await this.deleteAllLspDetailsChild(lspDetailsId, entityManager);

        const deleteLspDetails = await this.crudService
          .transact<LspDetails>(entityManager)
          .delete({ softDelete: false, deleteBy: { id: lspDetailsId } });

        if (deleteAllLspDetailsChild.affected > 0 && deleteLspDetails.affected > 0) return true;
      });

      if (deleteResult) return deleteResult;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteAllLspDetailsChild(lspDetailsId: string, entityManager: EntityManager) {
    const deleteLspAffiliations = await this.lspAffiliationsService.deleteAllLspAffiliationsByLspDetailsIdTransaction(lspDetailsId, entityManager);

    const deleteLspAwards = await this.lspAwardsService.deleteAllLspAwardsByLspDetailsIdTransaction(lspDetailsId, entityManager);

    const deleteLspCertifications = await this.lspCertificationService.deleteAllLspCertificationsByLspDetailsIdTransaction(
      lspDetailsId,
      entityManager
    );

    const deleteLspCoachings = await this.lspCoachingsService.deleteAllLspCoachingssByLspDetailsIdTransaction(lspDetailsId, entityManager);

    const deleteLspEducations = await this.lspEducationsService.deleteAllLspEducationsByLspDetailsIdTransaction(lspDetailsId, entityManager);

    const deleteLspProjects = await this.lspProjectsService.deleteAllLspProjectsByLspDetailsIdTransaction(lspDetailsId, entityManager);

    const deleteLspTrainings = await this.lspTrainingsService.deleteAllLspTrainingssByLspDetailsIdTransaction(lspDetailsId, entityManager);

    if (
      deleteLspAffiliations.affected > 0 &&
      deleteLspAwards.affected > 0 &&
      deleteLspCertifications.affected > 0 &&
      deleteLspCoachings.affected > 0 &&
      deleteLspEducations.affected > 0 &&
      deleteLspProjects.affected > 0 &&
      deleteLspTrainings.affected > 0
    )
      return { affected: 1 };
  }
}
