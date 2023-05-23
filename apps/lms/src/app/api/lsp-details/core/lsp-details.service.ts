import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspDetailsDto, LspDetails, UpdateLspDetailsDto } from '@gscwd-api/models';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { LspAffiliationsService } from '../components/lsp-affiliations';
import { LspAwardsService } from '../components/lsp-awards';
import { LspCertificationsService } from '../components/lsp-certifications';
import { LspCoachingsService } from '../components/lsp-coachings';
import { LspEducationsService } from '../components/lsp-educations';
import { LspExperiencesService } from '../components/lsp-experiences';
import { LspProjectsService } from '../components/lsp-projects';
import { LspTrainingsService } from '../components/lsp-trainings';

@Injectable()
export class LspDetailsService extends CrudHelper<LspDetails> {
  constructor(
    private readonly crudService: CrudService<LspDetails>,
    private readonly lspAffiliationsService: LspAffiliationsService,
    private readonly lspAwardsService: LspAwardsService,
    private readonly lspCertificationService: LspCertificationsService,
    private readonly lspCoachingsService: LspCoachingsService,
    private readonly lspEducationsService: LspEducationsService,
    private readonly lspExperiencesService: LspExperiencesService,
    private readonly lspProjectsService: LspProjectsService,
    private readonly lspTrainingsService: LspTrainingsService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  async addLspDetails(lspDetailsDto: CreateLspDetailsDto) {
    try {
      const lspDetails = await this.datasource.transaction(async (entityManager) => {
        const {
          subjectMatterExpertise,
          lspAffiliation,
          lspAward,
          lspCertification,
          lspCoaching,
          lspEducation,
          lspExperience,
          lspProject,
          lspTraining,
          ...rest
        } = lspDetailsDto;

        const newLspDetails = await this.crudService.transact<LspDetails>(entityManager).create({
          dto: { ...rest, subjectMatterExpertise: JSON.stringify(subjectMatterExpertise) },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        const newLspAffiliation = await Promise.all(
          lspAffiliation.map(async (lspAffiliationItem) => {
            return await this.lspAffiliationsService.addLspAffiliations(
              {
                lspDetails: newLspDetails,
                ...lspAffiliationItem,
              },
              entityManager
            );
          })
        );

        const newLspAward = await Promise.all(
          lspAward.map(async (lspAwardItem) => {
            return await this.lspAwardsService.addLspAwards(
              {
                lspDetails: newLspDetails,
                ...lspAwardItem,
              },
              entityManager
            );
          })
        );

        const newLspCertification = await Promise.all(
          lspCertification.map(async (lspCertificationItem) => {
            return await this.lspCertificationService.addLspCertifications(
              {
                lspDetails: newLspDetails,
                ...lspCertificationItem,
              },
              entityManager
            );
          })
        );

        const newLspCoaching = await Promise.all(
          lspCoaching.map(async (lspCoachingItem) => {
            return await this.lspCoachingsService.addLspCoachings(
              {
                lspDetails: newLspDetails,
                ...lspCoachingItem,
              },
              entityManager
            );
          })
        );

        const newLspEducation = await Promise.all(
          lspEducation.map(async (lspEducationItem) => {
            return await this.lspEducationsService.addLspEducations(
              {
                lspDetails: newLspDetails,
                ...lspEducationItem,
              },
              entityManager
            );
          })
        );

        const newLspExperience = await Promise.all(
          lspExperience.map(async (lspExperienceItem) => {
            return await this.lspExperiencesService.addLspExperiences(
              {
                lspDetails: newLspDetails,
                ...lspExperienceItem,
              },
              entityManager
            );
          })
        );

        const newLspProject = await Promise.all(
          lspProject.map(async (lspProjectItem) => {
            return await this.lspProjectsService.addLspProjects(
              {
                lspDetails: newLspDetails,
                ...lspProjectItem,
              },
              entityManager
            );
          })
        );

        const newLspTraining = await Promise.all(
          lspTraining.map(async (lspTrainingItem) => {
            return await this.lspTrainingsService.addLspTrainings(
              {
                lspDetails: newLspDetails,
                ...lspTrainingItem,
              },
              entityManager
            );
          })
        );

        return {
          ...newLspDetails,
          lspAffiliation: newLspAffiliation,
          lspAward: newLspAward,
          lspCertification: newLspCertification,
          lspCoaching: newLspCoaching,
          lspEducation: newLspEducation,
          lspExperience: newLspExperience,
          lspProject: newLspProject,
          lspTraining: newLspTraining,
        };
      });
      return lspDetails;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getLspDetailsById(lspDetailsId: string) {
    try {
      const { subjectMatterExpertise, ...rest } = await this.crudService.findOne({ find: { where: { id: lspDetailsId } } });
      const lspAffiliation = await this.lspAffiliationsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const lspAward = await this.lspAwardsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const lspCertification = await this.lspCertificationService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const lspCoaching = await this.lspCoachingsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const lspEducation = await this.lspEducationsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const lspExperience = await this.lspExperiencesService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const lspProject = await this.lspProjectsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const lspTraining = await this.lspTrainingsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });

      return {
        ...rest,
        subjectMatterExpertise: JSON.parse(subjectMatterExpertise),
        lspAffiliation,
        lspAward,
        lspCertification,
        lspCoaching,
        lspEducation,
        lspExperience,
        lspProject,
        lspTraining,
      };
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async updateLspDetailsById(updateLspDetailsDto: UpdateLspDetailsDto) {
    try {
      const {
        id,
        subjectMatterExpertise,
        lspAffiliation,
        lspAward,
        lspCertification,
        lspCoaching,
        lspEducation,
        lspExperience,
        lspProject,
        lspTraining,
        ...rest
      } = updateLspDetailsDto;

      const updateLspDetailsResult = await this.datasource.transaction(async (entityManager) => {
        const updateLspDetails = await this.crudService.transact<LspDetails>(entityManager).update({
          dto: { ...rest, subjectMatterExpertise: JSON.stringify(subjectMatterExpertise) },
          updateBy: { id },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        const deleteAllLspDetailsChild = await this.deleteAllLspDetailsChild(id, entityManager);

        const newLspAffiliation = await Promise.all(
          lspAffiliation.map(async (lspAffiliationItem) => {
            return await this.lspAffiliationsService.addLspAffiliations(
              {
                lspDetails: id,
                ...lspAffiliationItem,
              },
              entityManager
            );
          })
        );

        const newLspAward = await Promise.all(
          lspAward.map(async (lspAwardItem) => {
            return await this.lspAwardsService.addLspAwards(
              {
                lspDetails: id,
                ...lspAwardItem,
              },
              entityManager
            );
          })
        );

        const newLspCertification = await Promise.all(
          lspCertification.map(async (lspCertificationItem) => {
            return await this.lspCertificationService.addLspCertifications(
              {
                lspDetails: id,
                ...lspCertificationItem,
              },
              entityManager
            );
          })
        );

        const newLspCoaching = await Promise.all(
          lspCoaching.map(async (lspCoachingItem) => {
            return await this.lspCoachingsService.addLspCoachings(
              {
                lspDetails: id,
                ...lspCoachingItem,
              },
              entityManager
            );
          })
        );

        const newLspEducation = await Promise.all(
          lspEducation.map(async (lspEducationItem) => {
            return await this.lspEducationsService.addLspEducations(
              {
                lspDetails: id,
                ...lspEducationItem,
              },
              entityManager
            );
          })
        );

        const newLspExperience = await Promise.all(
          lspExperience.map(async (lspExperienceItem) => {
            return await this.lspExperiencesService.addLspExperiences(
              {
                lspDetails: id,
                ...lspExperienceItem,
              },
              entityManager
            );
          })
        );

        const newLspProject = await Promise.all(
          lspProject.map(async (lspProjectItem) => {
            return await this.lspProjectsService.addLspProjects(
              {
                lspDetails: id,
                ...lspProjectItem,
              },
              entityManager
            );
          })
        );

        const newLspTraining = await Promise.all(
          lspTraining.map(async (lspTrainingItem) => {
            return await this.lspTrainingsService.addLspTrainings(
              {
                lspDetails: id,
                ...lspTrainingItem,
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

      if (deleteResult) return lspDetails;
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

    const deleteLspExperiences = await this.lspExperiencesService.deleteAllLspExperiencesByLspDetailsIdTransaction(lspDetailsId, entityManager);

    const deleteLspProjects = await this.lspProjectsService.deleteAllLspProjectsByLspDetailsIdTransaction(lspDetailsId, entityManager);

    const deleteLspTrainings = await this.lspTrainingsService.deleteAllLspTrainingssByLspDetailsIdTransaction(lspDetailsId, entityManager);

    if (
      deleteLspAffiliations.affected > 0 &&
      deleteLspAwards.affected > 0 &&
      deleteLspCertifications.affected > 0 &&
      deleteLspCoachings.affected > 0 &&
      deleteLspEducations.affected > 0 &&
      deleteLspExperiences.affected > 0 &&
      deleteLspProjects.affected > 0 &&
      deleteLspTrainings.affected > 0
    )
      return { affected: 1 };
  }
}
