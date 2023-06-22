import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspDetailsDto, LspDetails, UpdateLspDetailsDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { LspIndividualAffiliationsService } from '../components/lsp-individual-affiliations';
import { LspIndividualAwardsService } from '../components/lsp-individual-awards';
import { LspCertificationsService } from '../components/lsp-certifications';
import { LspCoachingsService } from '../components/lsp-coachings';
import { LspEducationsService } from '../components/lsp-educations';
import { LspProjectsService } from '../components/lsp-projects';
import { LspTrainingsService } from '../components/lsp-trainings';

@Injectable()
export class LspIndividualDetailsService extends CrudHelper<LspDetails> {
  constructor(
    private readonly crudService: CrudService<LspDetails>,
    private readonly lspIndividualAffiliationsService: LspIndividualAffiliationsService,
    private readonly lspIndividualAwardsService: LspIndividualAwardsService,
    private readonly lspCertificationService: LspCertificationsService,
    private readonly lspCoachingsService: LspCoachingsService,
    private readonly lspEducationsService: LspEducationsService,
    private readonly lspProjectsService: LspProjectsService,
    private readonly lspTrainingsService: LspTrainingsService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  //insert learning service provider
  async addLspDetails(dto: CreateLspDetailsDto) {
    try {
      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        //deconstruct dto
        const { expertise, affiliations, awards, certifications, coaching, education, projects, trainings, ...rest } = dto;

        //insert learning service provider details
        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).create({
          dto: { ...rest, expertise: JSON.stringify(expertise) },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        //insert learning service provider affiliations
        const lspAffiliations = await Promise.all(
          affiliations.map(async (affiliationItem) => {
            return await this.lspIndividualAffiliationsService.addAffiliations(
              {
                lspDetails: lspDetails,
                ...affiliationItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider details
        const lspAwards = await Promise.all(
          awards.map(async (awardItem) => {
            return await this.lspIndividualAwardsService.addAwards(
              {
                lspDetails: lspDetails,
                ...awardItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider certification
        const lspCertifications = await Promise.all(
          certifications.map(async (certificationItem) => {
            return await this.lspCertificationService.addCertifications(
              {
                lspDetails: lspDetails,
                ...certificationItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider coaching
        const lspCoaching = await Promise.all(
          coaching.map(async (coachingItem) => {
            return await this.lspCoachingsService.addCoachings(
              {
                lspDetails: lspDetails,
                ...coachingItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider education
        const lspEducation = await Promise.all(
          education.map(async (educationItem) => {
            return await this.lspEducationsService.addEducations(
              {
                lspDetails: lspDetails,
                ...educationItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider project
        const lspProjects = await Promise.all(
          projects.map(async (projectItem) => {
            return await this.lspProjectsService.addProjects(
              {
                lspDetails: lspDetails,
                ...projectItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider training
        const lspTrainings = await Promise.all(
          trainings.map(async (trainingItem) => {
            return await this.lspTrainingsService.addTrainings(
              {
                lspDetails: lspDetails,
                ...trainingItem,
              },
              entityManager
            );
          })
        );

        //return result
        return {
          ...lspDetails,
          affiliations: lspAffiliations,
          awards: lspAwards,
          certifications: lspCertifications,
          coaching: lspCoaching,
          education: lspEducation,
          projects: lspProjects,
          trainings: lspTrainings,
        };
      });

      //return result
      return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  //get learning service provider by id
  async getLspDetailsById(lspDetailsId: string) {
    try {
      const { expertise, ...rest } = await this.crudService.findOne({
        find: {
          relations: { lspSource: true },
          where: { id: lspDetailsId },
        },
      });
      const affiliations = await this.lspIndividualAffiliationsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
      const awards = await this.lspIndividualAwardsService.crud().findAll({ find: { where: { lspDetails: { id: lspDetailsId } } } });
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

  //update learning service provider by id
  async updateLspDetailsById(dto: UpdateLspDetailsDto) {
    try {
      //deconstruct dto
      const { id, expertise, affiliations, awards, certifications, coaching, education, projects, trainings, ...rest } = dto;

      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        //update learning service provider details by id
        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).update({
          dto: { ...rest, expertise: JSON.stringify(expertise) },
          updateBy: { id },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        //delete all learning service provider child details
        const deleteAllLspDetailsChild = await this.deleteAllLspDetailsChild(id, entityManager);

        //insert new affiliations
        const lspAffiliations = await Promise.all(
          affiliations.map(async (affiliationItem) => {
            return await this.lspIndividualAffiliationsService.addAffiliations(
              {
                lspDetails: id,
                ...affiliationItem,
              },
              entityManager
            );
          })
        );

        //insert new awards
        const lspAwards = await Promise.all(
          awards.map(async (awardItem) => {
            return await this.lspIndividualAwardsService.addAwards(
              {
                lspDetails: id,
                ...awardItem,
              },
              entityManager
            );
          })
        );

        //insert new affiliations
        const lspCertifications = await Promise.all(
          certifications.map(async (certificationItem) => {
            return await this.lspCertificationService.addCertifications(
              {
                lspDetails: id,
                ...certificationItem,
              },
              entityManager
            );
          })
        );

        //insert new coaching
        const lspCoaching = await Promise.all(
          coaching.map(async (coachingItem) => {
            return await this.lspCoachingsService.addCoachings(
              {
                lspDetails: id,
                ...coachingItem,
              },
              entityManager
            );
          })
        );

        //insert new education
        const lspEducation = await Promise.all(
          education.map(async (educationItem) => {
            return await this.lspEducationsService.addEducations(
              {
                lspDetails: id,
                ...educationItem,
              },
              entityManager
            );
          })
        );

        //insert new projects
        const lspProjects = await Promise.all(
          projects.map(async (projectItem) => {
            return await this.lspProjectsService.addProjects(
              {
                lspDetails: id,
                ...projectItem,
              },
              entityManager
            );
          })
        );

        //insert new trainings
        const lspTrainings = await Promise.all(
          trainings.map(async (trainingItem) => {
            return await this.lspTrainingsService.addTrainings(
              {
                lspDetails: id,
                ...trainingItem,
              },
              entityManager
            );
          })
        );

        return lspDetails;
      });

      return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  //delete learning service provider by id
  async deleteLspDetailsById(lspDetailsId: string) {
    try {
      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        //delete all learning service provider child
        const lspChilds = await this.deleteAllLspDetailsChild(lspDetailsId, entityManager);

        //delete learning service provider details
        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).delete({ softDelete: false, deleteBy: { id: lspDetailsId } });

        if (lspChilds.affected > 0 && lspDetails.affected > 0) return lspDetails;
      });

      //return result
      if (result) return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  //delete all learning service provider child
  async deleteAllLspDetailsChild(lspDetailsId: string, entityManager: EntityManager) {
    const affiliations = await this.lspIndividualAffiliationsService.deleteAffiliations(lspDetailsId, entityManager);

    const awards = await this.lspIndividualAwardsService.deleteAwards(lspDetailsId, entityManager);

    const certifications = await this.lspCertificationService.deleteCertifications(lspDetailsId, entityManager);

    const coaching = await this.lspCoachingsService.deleteCoachings(lspDetailsId, entityManager);

    const education = await this.lspEducationsService.deleteEducations(lspDetailsId, entityManager);

    const projects = await this.lspProjectsService.deleteProjects(lspDetailsId, entityManager);

    const trainings = await this.lspTrainingsService.deleteTrainings(lspDetailsId, entityManager);

    if (
      affiliations.affected > 0 &&
      awards.affected > 0 &&
      certifications.affected > 0 &&
      coaching.affected > 0 &&
      education.affected > 0 &&
      projects.affected > 0 &&
      trainings.affected > 0
    )
      return { affected: 1 };
  }
}
