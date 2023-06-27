import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspOrganizationDetailsDto, LspOrganizationDetails } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LspOrganizationAffiliationsService } from '../components/lsp-organization-affiliations';
import { LspOrganizationAwardsService } from '../components/lsp-organization-awards';
import { LspOrganizationCertificationsService } from '../components/lsp-organization-certifications';

@Injectable()
export class LspOrganizationDetailsService extends CrudHelper<LspOrganizationDetails> {
  constructor(
    private readonly crudService: CrudService<LspOrganizationDetails>,
    private readonly lspOrganizationAffiliationsService: LspOrganizationAffiliationsService,
    private readonly lspOrganizationAwardsService: LspOrganizationAwardsService,
    private readonly lspOrganizationCertificationsService: LspOrganizationCertificationsService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  //insert learning service provider organization
  async addLspDetails(dto: CreateLspOrganizationDetailsDto) {
    try {
      //transaction result
      const result = await this.datasource.transaction(async (entityManager) => {
        //deconstruct dto
        const { expertise, affiliations, awards, certifications, ...rest } = dto;

        // coaching, education, projects, trainings,

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

        // //insert learning service provider coaching
        // const lspCoaching = await Promise.all(
        //   coaching.map(async (coachingItem) => {
        //     return await this.lspIndividualCoachingsService.addCoachings(
        //       {
        //         lspIndividualDetails: lspDetails,
        //         ...coachingItem,
        //       },
        //       entityManager
        //     );
        //   })
        // );

        // //insert learning service provider education
        // const lspEducation = await Promise.all(
        //   education.map(async (educationItem) => {
        //     return await this.lspIndividualEducationsService.addEducations(
        //       {
        //         lspIndividualDetails: lspDetails,
        //         ...educationItem,
        //       },
        //       entityManager
        //     );
        //   })
        // );

        // //insert learning service provider project
        // const lspProjects = await Promise.all(
        //   projects.map(async (projectItem) => {
        //     return await this.lspIndividualProjectsService.addProjects(
        //       {
        //         lspIndividualDetails: lspDetails,
        //         ...projectItem,
        //       },
        //       entityManager
        //     );
        //   })
        // );

        // //insert learning service provider training
        // const lspTrainings = await Promise.all(
        //   trainings.map(async (trainingItem) => {
        //     return await this.lspIndividualTrainingsService.addTrainings(
        //       {
        //         lspIndividualDetails: lspDetails,
        //         ...trainingItem,
        //       },
        //       entityManager
        //     );
        //   })
        // );

        //return result
        return {
          ...lspDetails,
          //   affiliations: lspAffiliations,
          //   awards: lspAwards,
          //   certifications: lspCertifications,
          //   coaching: lspCoaching,
          //   education: lspEducation,
          //   projects: lspProjects,
          //   trainings: lspTrainings,
        };
      });

      //return result
      return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
