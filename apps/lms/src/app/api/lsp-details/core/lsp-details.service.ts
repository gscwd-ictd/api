import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspIndividualExternalDto, CreateLspIndividualInternalDto, CreateLspOrganizationExternalDto, LspDetails } from '@gscwd-api/models';
import { LspSource, LspType, EmployeeFullName } from '@gscwd-api/utils';
import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async findLspIndividual() {
    const lsp = await this.datasource.getRepository(LspDetails).find({
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        middleName: true,
        lastName: true,
        prefixName: true,
        suffixName: true,
        extensionName: true,
        email: true,
        lspSource: true,
        postalAddress: true,
      },
      where: { lspType: LspType.INDIVIDUAL },
    });

    const employees = Promise.all(
      lsp.map(async (lspItems) => {
        let name: string;

        if (lspItems.employeeId !== null) {
          name = (await this.employeesService.findEmployeesById(lspItems.employeeId)).fullName;
        } else {
          name = (await this.datasource.query('select get_lsp_fullname($1) fullname', [lspItems.id]))[0].fullname;
        }

        return {
          id: lspItems.id,
          name: name,
          email: lspItems.email,
          lspSource: lspItems.lspSource,
          postalAddress: lspItems.postalAddress,
        };
      })
    );

    return employees;
  }

  // add lsp (type = individual, source = internal)
  async addLspIndividualInternal(data: CreateLspIndividualInternalDto) {
    //deconstruct data
    const { expertise, coaching, projects, trainings, ...rest } = data;
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

        //insert lsp coaching
        await Promise.all(
          coaching.map(async (coachingItem) => {
            return await this.lspCertificationsService.create(
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
}
