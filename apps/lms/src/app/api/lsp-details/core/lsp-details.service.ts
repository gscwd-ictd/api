import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspIndividualExternalDto, CreateLspIndividualInternalDto, CreateLspOrganizationExternalDto, LspDetails } from '@gscwd-api/models';
import { LspSource, LspType } from '@gscwd-api/utils';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LspAffiliationsService } from '../components/lsp-affiliations';
import { LspAwardsService } from '../components/lsp-awards';
import { LspCertificationsService } from '../components/lsp-certifications';
import { LspCoachingsService } from '../components/lsp-coachings';
import { LspEducationsService } from '../components/lsp-educations';
import { LspProjectsService } from '../components/lsp-projects';
import { LspTrainingsService } from '../components/lsp-trainings';
import { EmployeesService } from '../../../services/employees';

@Injectable()
export class LspDetailsService extends CrudHelper<LspDetails> {
  constructor(
    private readonly crudService: CrudService<LspDetails>,
    private readonly lspAffiliationsService: LspAffiliationsService,
    private readonly lspAwardsService: LspAwardsService,
    private readonly lspCertificationsService: LspCertificationsService,
    private readonly lspCoachingsService: LspCoachingsService,
    private readonly lspEducationsService: LspEducationsService,
    private readonly lspProjectsService: LspProjectsService,
    private readonly lspTrainingsService: LspTrainingsService,
    private readonly employeesService: EmployeesService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  // add lsp (type = individual, source = internal)
  async addLspIndividualInternal(data: CreateLspIndividualInternalDto) {
    //deconstruct data
    const { expertise, affiliations, coaching, projects, trainings, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // insert lsp details
        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).create({
          dto: {
            ...rest,
            expertise: JSON.stringify(expertise),
            lspType: LspType.INDIVIDUAL,
            lspSource: LspSource.INTERNAL,
          },
          onError: () => new BadRequestException(),
        });

        //insert lsp affiliations
        await Promise.all(
          affiliations.map(async (affiliationItem) => {
            return await this.lspAffiliationsService.create(
              {
                lspDetails,
                ...affiliationItem,
              },
              entityManager
            );
          })
        );

        //insert lsp coaching
        await Promise.all(
          coaching.map(async (coachingItem) => {
            return await this.lspCoachingsService.create(
              {
                lspDetails,
                ...coachingItem,
              },
              entityManager
            );
          })
        );

        //insert lsp projects
        await Promise.all(
          projects.map(async (projectItem) => {
            return await this.lspProjectsService.create(
              {
                lspDetails,
                ...projectItem,
              },
              entityManager
            );
          })
        );

        //insert lsp trainings
        await Promise.all(
          trainings.map(async (trainingItem) => {
            return await this.lspTrainingsService.create(
              {
                lspDetails,
                ...trainingItem,
              },
              entityManager
            );
          })
        );

        return data;
      });

      return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // add lsp (type = individual, source = external)
  async addLspIndividualExternal(data: CreateLspIndividualExternalDto) {
    //deconstruct data
    const { expertise, affiliations, awards, certifications, coaching, education, projects, trainings, ...rest } = data;

    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // insert lsp details
        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).create({
          dto: {
            ...rest,
            expertise: JSON.stringify(expertise),
            lspType: LspType.INDIVIDUAL,
            lspSource: LspSource.EXTERNAL,
          },
          onError: () => new BadRequestException(),
        });

        //insert lsp affiliations
        await Promise.all(
          affiliations.map(async (affiliationItem) => {
            return await this.lspAffiliationsService.create(
              {
                lspDetails,
                ...affiliationItem,
              },
              entityManager
            );
          })
        );

        //insert lsp awards
        await Promise.all(
          awards.map(async (awardItem) => {
            return await this.lspAwardsService.create(
              {
                lspDetails,
                ...awardItem,
              },
              entityManager
            );
          })
        );

        //insert lsp certifications
        await Promise.all(
          certifications.map(async (certificationItem) => {
            return await this.lspCertificationsService.create(
              {
                lspDetails,
                ...certificationItem,
              },
              entityManager
            );
          })
        );

        //insert lsp coaching
        await Promise.all(
          coaching.map(async (coachingItem) => {
            return await this.lspCoachingsService.create(
              {
                lspDetails,
                ...coachingItem,
              },
              entityManager
            );
          })
        );

        //insert lsp educations
        await Promise.all(
          education.map(async (educationItem) => {
            return await this.lspEducationsService.create(
              {
                lspDetails,
                ...educationItem,
              },
              entityManager
            );
          })
        );

        //insert lsp projects
        await Promise.all(
          projects.map(async (projectItem) => {
            return await this.lspProjectsService.create(
              {
                lspDetails,
                ...projectItem,
              },
              entityManager
            );
          })
        );

        //insert lsp trainings
        await Promise.all(
          trainings.map(async (trainingItem) => {
            return await this.lspTrainingsService.create(
              {
                lspDetails,
                ...trainingItem,
              },
              entityManager
            );
          })
        );

        return data;
      });

      return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // add lsp (type = organization, source = external)
  async addLspOrganizationExternal(data: CreateLspOrganizationExternalDto) {
    const { expertise, affiliations, awards, certifications, coaching, trainings, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // insert lsp details
        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).create({
          dto: {
            ...rest,
            expertise: JSON.stringify(expertise),
            lspType: LspType.ORGANIZATION,
            lspSource: LspSource.EXTERNAL,
          },
          onError: () => new BadRequestException(),
        });

        //insert lsp affiliations
        await Promise.all(
          affiliations.map(async (affiliationItem) => {
            return await this.lspAffiliationsService.create(
              {
                lspDetails,
                ...affiliationItem,
              },
              entityManager
            );
          })
        );

        //insert lsp awards
        await Promise.all(
          awards.map(async (awardItem) => {
            return await this.lspAwardsService.create(
              {
                lspDetails,
                ...awardItem,
              },
              entityManager
            );
          })
        );

        //insert lsp certifications
        await Promise.all(
          certifications.map(async (certificationItem) => {
            return await this.lspCertificationsService.create(
              {
                lspDetails,
                ...certificationItem,
              },
              entityManager
            );
          })
        );

        //insert lsp coaching
        await Promise.all(
          coaching.map(async (coachingItem) => {
            return await this.lspCoachingsService.create(
              {
                lspDetails,
                ...coachingItem,
              },
              entityManager
            );
          })
        );

        //insert lsp trainings
        await Promise.all(
          trainings.map(async (trainingItem) => {
            return await this.lspProjectsService.create(
              {
                lspDetails,
                ...trainingItem,
              },
              entityManager
            );
          })
        );

        return data;
      });

      return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getLspById(id: string) {
    const lspDetails = await this.crudService.findOne({
      find: { select: { lspType: true, lspSource: true }, where: { id: id } },
      onError: () => new NotFoundException(),
    });

    switch (true) {
      case lspDetails.lspType === LspType.INDIVIDUAL && lspDetails.lspSource === LspSource.INTERNAL:
        return await this.getLspIndividualInternal(id);
      case lspDetails.lspType === LspType.INDIVIDUAL && lspDetails.lspSource === LspSource.EXTERNAL:
        return 'Individual External';
      case lspDetails.lspType === LspType.ORGANIZATION && lspDetails.lspSource === LspSource.EXTERNAL:
        return 'Organization External';
      default:
        return () => new NotFoundException();
    }
  }

  async getLspIndividualInternal(id: string) {
    const lspDetails = await this.crudService.findOne({
      find: {
        select: { employeeId: true, expertise: true, experience: true, introduction: true, lspType: true, lspSource: true },
        where: { id: id },
      },
      onError: () => new NotFoundException(),
    });

    const name = (await this.employeesService.findEmployeesById(lspDetails.employeeId)).fullName;

    const affiliations = await this.lspAffiliationsService.crud().findAll({ find: { where: { lspDetails: lspDetails } } });
    const awards = [];
    const certifications = [];
    const coaching = await this.lspCoachingsService.crud().findAll({ find: { where: { lspDetails: lspDetails } } });
    const education = [];
    const projects = await this.lspProjectsService.crud().findAll({ find: { where: { lspDetails: lspDetails } } });
    const trainings = await this.lspTrainingsService.crud().findAll({ find: { where: { lspDetails: lspDetails } } });

    return {
      ...lspDetails,
      expertise: JSON.parse(lspDetails.expertise),
      name,
      affiliations,
      awards,
      certifications,
      coaching,
      education,
      projects,
      trainings,
    };
  }
}
