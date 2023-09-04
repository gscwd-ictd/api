import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspIndividualDetailsDto, LspIndividualDetails, UpdateLspIndividualDetailsDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { LspIndividualAffiliationsService } from '../components/lsp-individual-affiliations';
import { LspIndividualAwardsService } from '../components/lsp-individual-awards';
import { LspIndividualCertificationsService } from '../components/lsp-individual-certifications';
import { LspIndividualCoachingsService } from '../components/lsp-individual-coachings';
import { LspIndividualEducationsService } from '../components/lsp-individual-educations';
import { LspIndividualProjectsService } from '../components/lsp-individual-projects';
import { LspIndividualTrainingsService } from '../components/lsp-individual-trainings';

@Injectable()
export class LspIndividualDetailsService extends CrudHelper<LspIndividualDetails> {
  constructor(
    private readonly crudService: CrudService<LspIndividualDetails>,
    private readonly lspIndividualAffiliationsService: LspIndividualAffiliationsService,
    private readonly lspIndividualAwardsService: LspIndividualAwardsService,
    private readonly lspIndividualCertificationService: LspIndividualCertificationsService,
    private readonly lspIndividualCoachingsService: LspIndividualCoachingsService,
    private readonly lspIndividualEducationsService: LspIndividualEducationsService,
    private readonly lspIndividualProjectsService: LspIndividualProjectsService,
    private readonly lspIndividualTrainingsService: LspIndividualTrainingsService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  //insert learning service provider
  async addLspDetails(dto: CreateLspIndividualDetailsDto) {
    try {
      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        //deconstruct dto
        const { expertise, affiliations, awards, certifications, coaching, education, projects, trainings, ...rest } = dto;

        //insert learning service provider details
        const lspDetails = await this.crudService.transact<LspIndividualDetails>(entityManager).create({
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
                lspIndividualDetails: lspDetails,
                ...affiliationItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider awards
        const lspAwards = await Promise.all(
          awards.map(async (awardItem) => {
            return await this.lspIndividualAwardsService.addAwards(
              {
                lspIndividualDetails: lspDetails,
                ...awardItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider certification
        const lspCertifications = await Promise.all(
          certifications.map(async (certificationItem) => {
            return await this.lspIndividualCertificationService.addCertifications(
              {
                lspIndividualDetails: lspDetails,
                ...certificationItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider coaching
        const lspCoaching = await Promise.all(
          coaching.map(async (coachingItem) => {
            return await this.lspIndividualCoachingsService.addCoachings(
              {
                lspIndividualDetails: lspDetails,
                ...coachingItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider education
        const lspEducation = await Promise.all(
          education.map(async (educationItem) => {
            return await this.lspIndividualEducationsService.addEducations(
              {
                lspIndividualDetails: lspDetails,
                ...educationItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider project
        const lspProjects = await Promise.all(
          projects.map(async (projectItem) => {
            return await this.lspIndividualProjectsService.addProjects(
              {
                lspIndividualDetails: lspDetails,
                ...projectItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider training
        const lspTrainings = await Promise.all(
          trainings.map(async (trainingItem) => {
            return await this.lspIndividualTrainingsService.addTrainings(
              {
                lspIndividualDetails: lspDetails,
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
      const affiliations = await this.lspIndividualAffiliationsService
        .crud()
        .findAll({ find: { where: { lspIndividualDetails: { id: lspDetailsId } } } });
      const awards = await this.lspIndividualAwardsService.crud().findAll({ find: { where: { lspIndividualDetails: { id: lspDetailsId } } } });
      const certifications = await this.lspIndividualCertificationService
        .crud()
        .findAll({ find: { where: { lspIndividualDetails: { id: lspDetailsId } } } });
      const coaching = await this.lspIndividualCoachingsService.crud().findAll({ find: { where: { lspIndividualDetails: { id: lspDetailsId } } } });
      const education = await this.lspIndividualEducationsService.crud().findAll({ find: { where: { lspIndividualDetails: { id: lspDetailsId } } } });
      const projects = await this.lspIndividualProjectsService.crud().findAll({ find: { where: { lspIndividualDetails: { id: lspDetailsId } } } });
      const trainings = await this.lspIndividualTrainingsService.crud().findAll({ find: { where: { lspIndividualDetails: { id: lspDetailsId } } } });

      return {
        ...rest,
        fullName: `${rest.firstName} ${rest.middleName[0].toUpperCase()} ${rest.lastName}`,
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
  async updateLspDetailsById(dto: UpdateLspIndividualDetailsDto) {
    try {
      //deconstruct dto
      const { id, expertise, affiliations, awards, certifications, coaching, education, projects, trainings, ...rest } = dto;

      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        //update learning service provider details by id
        const lspDetails = await this.crudService.transact<LspIndividualDetails>(entityManager).update({
          dto: { ...rest, expertise: JSON.stringify(expertise) },
          updateBy: { id },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        //delete all learning service provider child details
        await this.deleteAllLspDetailsChild(id, entityManager);

        //insert new affiliations
        await Promise.all(
          affiliations.map(async (affiliationItem) => {
            return await this.lspIndividualAffiliationsService.addAffiliations(
              {
                lspIndividualDetails: id,
                ...affiliationItem,
              },
              entityManager
            );
          })
        );

        //insert new awards
        await Promise.all(
          awards.map(async (awardItem) => {
            return await this.lspIndividualAwardsService.addAwards(
              {
                lspIndividualDetails: id,
                ...awardItem,
              },
              entityManager
            );
          })
        );

        //insert new affiliations
        await Promise.all(
          certifications.map(async (certificationItem) => {
            return await this.lspIndividualCertificationService.addCertifications(
              {
                lspIndividualDetails: id,
                ...certificationItem,
              },
              entityManager
            );
          })
        );

        //insert new coaching
        await Promise.all(
          coaching.map(async (coachingItem) => {
            return await this.lspIndividualCoachingsService.addCoachings(
              {
                lspIndividualDetails: id,
                ...coachingItem,
              },
              entityManager
            );
          })
        );

        //insert new education
        await Promise.all(
          education.map(async (educationItem) => {
            return await this.lspIndividualEducationsService.addEducations(
              {
                lspIndividualDetails: id,
                ...educationItem,
              },
              entityManager
            );
          })
        );

        //insert new projects
        await Promise.all(
          projects.map(async (projectItem) => {
            return await this.lspIndividualProjectsService.addProjects(
              {
                lspIndividualDetails: id,
                ...projectItem,
              },
              entityManager
            );
          })
        );

        //insert new trainings
        await Promise.all(
          trainings.map(async (trainingItem) => {
            return await this.lspIndividualTrainingsService.addTrainings(
              {
                lspIndividualDetails: id,
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
        const lspDetails = await this.crudService
          .transact<LspIndividualDetails>(entityManager)
          .delete({ softDelete: false, deleteBy: { id: lspDetailsId } });

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

    const certifications = await this.lspIndividualCertificationService.deleteCertifications(lspDetailsId, entityManager);

    const coaching = await this.lspIndividualCoachingsService.deleteCoachings(lspDetailsId, entityManager);

    const education = await this.lspIndividualEducationsService.deleteEducations(lspDetailsId, entityManager);

    const projects = await this.lspIndividualProjectsService.deleteProjects(lspDetailsId, entityManager);

    const trainings = await this.lspIndividualTrainingsService.deleteTrainings(lspDetailsId, entityManager);

    if (
      affiliations.affected > 0 ||
      awards.affected > 0 ||
      certifications.affected > 0 ||
      coaching.affected > 0 ||
      education.affected > 0 ||
      projects.affected > 0 ||
      trainings.affected > 0
    )
      return { affected: 1 };
    else return { affected: 0 };
  }
}
