import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspOrganizationDetailsDto, LspOrganizationDetails, UpdateLspOrganizationDetailsDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { LspOrganizationAffiliationsService } from '../components/lsp-organization-affiliations';
import { LspOrganizationAwardsService } from '../components/lsp-organization-awards';
import { LspOrganizationCertificationsService } from '../components/lsp-organization-certifications';
import { LspOrganizationCoachingsService } from '../components/lsp-organization-coachings';
import { LspOrganizationTrainingsService } from '../components/lsp-organization-trainings';

@Injectable()
export class LspOrganizationDetailsService extends CrudHelper<LspOrganizationDetails> {
  constructor(
    private readonly crudService: CrudService<LspOrganizationDetails>,
    private readonly lspOrganizationAffiliationsService: LspOrganizationAffiliationsService,
    private readonly lspOrganizationAwardsService: LspOrganizationAwardsService,
    private readonly lspOrganizationCertificationsService: LspOrganizationCertificationsService,
    private readonly lspOrganizationCoachingsService: LspOrganizationCoachingsService,
    private readonly lspOrganizationTrainingsService: LspOrganizationTrainingsService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  //insert learning service provider organization
  async addLspDetails(data: CreateLspOrganizationDetailsDto) {
    try {
      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        //deconstruct dto
        const { expertise, affiliations, awards, certifications, coaching, trainings, ...rest } = data;

        //insert learning service provider organization details
        const lspDetails = await this.crudService.transact<LspOrganizationDetails>(entityManager).create({
          dto: { ...rest, expertise: JSON.stringify(expertise) },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        //insert learning service provider organization affiliations
        const lspAffiliations = await Promise.all(
          affiliations.map(async (affiliationItem) => {
            return await this.lspOrganizationAffiliationsService.addAffiliations(
              {
                lspOrganizationDetails: lspDetails,
                ...affiliationItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider organization awards
        const lspAwards = await Promise.all(
          awards.map(async (awardItem) => {
            return await this.lspOrganizationAwardsService.addAwards(
              {
                lspOrganizationDetails: lspDetails,
                ...awardItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider organization certification
        const lspCertifications = await Promise.all(
          certifications.map(async (certificationItem) => {
            return await this.lspOrganizationCertificationsService.addCertifications(
              {
                lspOrganizationDetails: lspDetails,
                ...certificationItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider organization coaching
        const lspCoaching = await Promise.all(
          coaching.map(async (coachingItem) => {
            return await this.lspOrganizationCoachingsService.addCoachings(
              {
                lspOrganizationDetails: lspDetails,
                ...coachingItem,
              },
              entityManager
            );
          })
        );

        //insert learning service provider organization training
        const lspTrainings = await Promise.all(
          trainings.map(async (trainingItem) => {
            return await this.lspOrganizationTrainingsService.addTrainings(
              {
                lspOrganizationDetails: lspDetails,
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
          trainings: lspTrainings,
        };
      });

      //return result
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  //get learning service provider organization by id
  async getLspDetailsById(lspDetailsId: string) {
    try {
      //learning service provider organization details
      const { expertise, ...rest } = await this.crudService.findOne({
        find: {
          relations: { lspSource: true },
          where: { id: lspDetailsId },
        },
      });

      //learning service provider organization affiliations
      const affiliations = await this.lspOrganizationAffiliationsService
        .crud()
        .findAll({ find: { where: { lspOrganizationDetails: { id: lspDetailsId } } } });

      //learning service provider organization awards
      const awards = await this.lspOrganizationAwardsService.crud().findAll({ find: { where: { lspOrganizationDetails: { id: lspDetailsId } } } });

      //learning service provider organization certifications
      const certifications = await this.lspOrganizationCertificationsService
        .crud()
        .findAll({ find: { where: { lspOrganizationDetails: { id: lspDetailsId } } } });

      //learning service provider organization coaching
      const coaching = await this.lspOrganizationCoachingsService
        .crud()
        .findAll({ find: { where: { lspOrganizationDetails: { id: lspDetailsId } } } });

      //learning service provider organization trainings
      const trainings = await this.lspOrganizationTrainingsService
        .crud()
        .findAll({ find: { where: { lspOrganizationDetails: { id: lspDetailsId } } } });

      return {
        ...rest,
        expertise: JSON.parse(expertise),
        affiliations,
        awards,
        certifications,
        coaching,
        trainings,
      };
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  //update learning service organization provider by id
  async updateLspDetailsById(data: UpdateLspOrganizationDetailsDto) {
    try {
      //deconstruct dto
      const { id, expertise, affiliations, awards, certifications, coaching, trainings, ...rest } = data;

      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        //update learning service provider details by id
        const lspDetails = await this.crudService.transact<LspOrganizationDetails>(entityManager).update({
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
            return await this.lspOrganizationAffiliationsService.addAffiliations(
              {
                lspOrganizationDetails: id,
                ...affiliationItem,
              },
              entityManager
            );
          })
        );

        //insert new awards
        const lspAwards = await Promise.all(
          awards.map(async (awardItem) => {
            return await this.lspOrganizationAwardsService.addAwards(
              {
                lspOrganizationDetails: id,
                ...awardItem,
              },
              entityManager
            );
          })
        );

        //insert new affiliations
        const lspIndividualCertifications = await Promise.all(
          certifications.map(async (certificationItem) => {
            return await this.lspOrganizationCertificationsService.addCertifications(
              {
                lspOrganizationDetails: id,
                ...certificationItem,
              },
              entityManager
            );
          })
        );

        //insert new coaching
        const lspCoaching = await Promise.all(
          coaching.map(async (coachingItem) => {
            return await this.lspOrganizationCoachingsService.addCoachings(
              {
                lspOrganizationDetails: id,
                ...coachingItem,
              },
              entityManager
            );
          })
        );

        //insert new trainings
        const lspTrainings = await Promise.all(
          trainings.map(async (trainingItem) => {
            return await this.lspOrganizationTrainingsService.addTrainings(
              {
                lspOrganizationDetails: id,
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
          .transact<LspOrganizationDetails>(entityManager)
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
    const affiliations = await this.lspOrganizationAffiliationsService.deleteAffiliations(lspDetailsId, entityManager);

    const awards = await this.lspOrganizationAwardsService.deleteAwards(lspDetailsId, entityManager);

    const certifications = await this.lspOrganizationCertificationsService.deleteCertifications(lspDetailsId, entityManager);

    const coaching = await this.lspOrganizationCoachingsService.deleteCoachings(lspDetailsId, entityManager);

    const trainings = await this.lspOrganizationTrainingsService.deleteTrainings(lspDetailsId, entityManager);

    if (affiliations.affected > 0 || awards.affected > 0 || certifications.affected > 0 || coaching.affected > 0 || trainings.affected > 0)
      return { affected: 1 };
  }
}
