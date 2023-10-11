import { CrudHelper, CrudService } from '@gscwd-api/crud';
import {
  CreateLspIndividualExternalDto,
  CreateLspIndividualInternalDto,
  CreateLspOrganizationExternalDto,
  LspDetails,
  UpdateLspIndividualExternalDto,
  UpdateLspIndividualInternalDto,
  UpdateLspOrganizationExternalDto,
} from '@gscwd-api/models';
import { LspSource, LspType } from '@gscwd-api/utils';
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { LspAffiliationsService } from '../components/lsp-affiliations';
import { LspAwardsService } from '../components/lsp-awards';
import { LspCertificationsService } from '../components/lsp-certifications';
import { LspCoachingsService } from '../components/lsp-coachings';
import { LspEducationsService } from '../components/lsp-educations';
import { LspProjectsService } from '../components/lsp-projects';
import { LspTrainingsService } from '../components/lsp-trainings';
import { PortalEmployeesService } from '../../../services/portal';

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
    private readonly portalEmployeesService: PortalEmployeesService,
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
      Logger.log(error);
      throw new BadRequestException();
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
      Logger.log(error);
      throw new BadRequestException();
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
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async findLspDetailsById(id: string) {
    let name: string;
    const result = await this.crudService.findOne({
      find: { select: { id: true, employeeId: true, organizationName: true, lspType: true, lspSource: true }, where: { id: id } },
      onError: () => new NotFoundException(),
    });

    switch (true) {
      case result.lspType === LspType.INDIVIDUAL && result.lspSource === LspSource.INTERNAL:
        name = (await this.portalEmployeesService.findEmployeesDetailsById(result.employeeId)).fullName;
        break;
      case result.lspType === LspType.INDIVIDUAL && result.lspSource === LspSource.EXTERNAL:
        name = (await this.datasource.query('select get_lsp_fullname($1) fullname', [result.id]))[0].fullname;
        break;
      case result.lspType === LspType.ORGANIZATION && result.lspSource === LspSource.EXTERNAL:
        name = result.organizationName;
        break;
      default:
        return () => new BadRequestException();
    }

    return {
      id: result.id,
      name: name,
      type: result.lspType,
    };
  }

  // get lsp by id
  async getLspById(id: string) {
    const lspDetails = await this.crudService.findOne({
      find: { select: { lspType: true, lspSource: true }, where: { id: id } },
      onError: () => new NotFoundException(),
    });

    switch (true) {
      case lspDetails.lspType === LspType.INDIVIDUAL && lspDetails.lspSource === LspSource.INTERNAL:
        return await this.getLspIndividualInternal(id);
      case lspDetails.lspType === LspType.INDIVIDUAL && lspDetails.lspSource === LspSource.EXTERNAL:
        return await this.getLspIndividualExternal(id);
      case lspDetails.lspType === LspType.ORGANIZATION && lspDetails.lspSource === LspSource.EXTERNAL:
        return await this.getLspOrganizationExternal(id);
      default:
        return () => new NotFoundException();
    }
  }

  // get lsp (type = individual, source = internal)
  async getLspIndividualInternal(id: string) {
    try {
      const lspDetails = await this.crudService.findOne({
        find: {
          select: { id: true, employeeId: true, expertise: true, experience: true, introduction: true, lspType: true, lspSource: true },
          where: { id: id },
        },
        onError: () => new NotFoundException(),
      });

      const employeeDetails = await this.portalEmployeesService.findEmployeesDetailsById(lspDetails.employeeId);

      const affiliations = await this.lspAffiliationsService
        .crud()
        .findAll({ find: { select: { position: true, institution: true }, where: { lspDetails: { id } } } });
      const coaching = await this.lspCoachingsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });
      const projects = await this.lspProjectsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });
      const trainings = await this.lspTrainingsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      return {
        id: lspDetails.id,
        employeeId: employeeDetails.employeeId,
        name: employeeDetails.fullName,
        expertise: JSON.parse(lspDetails.expertise),
        contactNumber: employeeDetails.contactNumber,
        email: employeeDetails.email,
        postalAddress: employeeDetails.postalAddress,
        photoUrl: employeeDetails.photoUrl,
        tin: employeeDetails.tin,
        experience: lspDetails.experience,
        introduction: lspDetails.introduction,
        affiliations,
        awards: employeeDetails.awards,
        certifications: employeeDetails.certifications,
        coaching,
        education: employeeDetails.educations,
        projects,
        trainings,
      };
    } catch (error) {
      Logger.log(error);
      throw new NotFoundException();
    }
  }

  // get lsp (type = individual, source = external)
  async getLspIndividualExternal(id: string) {
    try {
      const lspDetails = await this.crudService.findOne({
        find: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            prefixName: true,
            suffixName: true,
            extensionName: true,
            expertise: true,
            contactNumber: true,
            email: true,
            postalAddress: true,
            photoUrl: true,
            tin: true,
            experience: true,
            introduction: true,
            lspType: true,
            lspSource: true,
          },
          where: { id: id },
        },
        onError: () => new NotFoundException(),
      });

      const affiliations = await this.lspAffiliationsService
        .crud()
        .findAll({ find: { select: { position: true, institution: true }, where: { lspDetails: { id } } } });
      const awards = await this.lspAwardsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });
      const certifications = await this.lspCertificationsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });
      const coaching = await this.lspCoachingsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });
      const education = await this.lspEducationsService
        .crud()
        .findAll({ find: { select: { degree: true, institution: true }, where: { lspDetails: { id } } } });
      const projects = await this.lspProjectsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });
      const trainings = await this.lspTrainingsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      return {
        ...lspDetails,
        expertise: JSON.parse(lspDetails.expertise),
        affiliations,
        awards,
        certifications,
        coaching,
        education,
        projects,
        trainings,
      };
    } catch (error) {
      Logger.log(error);
      throw new NotFoundException();
    }
  }

  // get lsp by id (type = organization, source = external)
  async getLspOrganizationExternal(id: string) {
    try {
      const lspDetails = await this.crudService.findOne({
        find: {
          select: {
            id: true,
            organizationName: true,
            expertise: true,
            contactNumber: true,
            email: true,
            postalAddress: true,
            photoUrl: true,
            tin: true,
            experience: true,
            introduction: true,
            lspType: true,
            lspSource: true,
          },
          where: { id: id },
        },
        onError: () => new NotFoundException(),
      });

      const affiliations = await this.lspAffiliationsService
        .crud()
        .findAll({ find: { select: { position: true, institution: true }, where: { lspDetails: { id } } } });
      const awards = await this.lspAwardsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });
      const certifications = await this.lspCertificationsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });
      const coaching = await this.lspCoachingsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });
      const trainings = await this.lspTrainingsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      return {
        ...lspDetails,
        expertise: JSON.parse(lspDetails.expertise),
        affiliations,
        awards,
        certifications,
        coaching,
        trainings,
      };
    } catch (error) {
      Logger.log(error);
      throw new NotFoundException();
    }
  }

  // update lsp by id (type = individual, source = internal)
  async updateLspIndividualInternal(data: UpdateLspIndividualInternalDto) {
    const { id, expertise, affiliations, coaching, projects, trainings, ...rest } = data;

    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        await this.deleteLspComponentsById(id, entityManager);
        await this.crudService.transact<LspDetails>(entityManager).update({
          updateBy: { id },
          dto: {
            ...rest,
            expertise: JSON.stringify(expertise),
          },
          onError: () => new BadRequestException(),
        });

        const lspDetails = await this.crudService.findOneBy({ findBy: { id } });

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

      // return result
      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  // update lsp by id (type = individual, source = external)
  async updateLspIndividualExternal(data: UpdateLspIndividualExternalDto) {
    const { id, expertise, affiliations, awards, certifications, coaching, education, projects, trainings, ...rest } = data;

    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        await this.deleteLspComponentsById(id, entityManager);
        await this.crudService.transact<LspDetails>(entityManager).update({
          updateBy: { id },
          dto: {
            ...rest,
            expertise: JSON.stringify(expertise),
          },
          onError: () => new BadRequestException(),
        });

        const lspDetails = await this.crudService.findOneBy({ findBy: { id } });

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
      Logger.log(error);
      throw new BadRequestException();
    }
  }

  // update lsp (type = organization, source = external)
  async updateLspOrganizationExternal(data: UpdateLspOrganizationExternalDto) {
    const { id, expertise, affiliations, awards, certifications, coaching, trainings, ...rest } = data;

    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        await this.deleteLspComponentsById(id, entityManager);
        await this.crudService.transact<LspDetails>(entityManager).update({
          updateBy: { id },
          dto: {
            ...rest,
            expertise: JSON.stringify(expertise),
          },
          onError: () => new BadRequestException(),
        });

        const lspDetails = await this.crudService.findOneBy({ findBy: { id } });

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
      throw new BadRequestException();
    }
  }

  // delete lsp by id
  async deleteLspById(id: string) {
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // delete lsp components by lsp id
        await this.deleteLspComponentsById(id, entityManager);

        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).delete({
          softDelete: true,
          deleteBy: { id },
        });
        return lspDetails;
      });
      return result;
    } catch (error) {
      throw new BadRequestException();
      // const queryFailedError = error as unknown as QueryFailedError;
      // console.log(queryFailedError.message);
      // if (
      //   queryFailedError.message ===
      //   `QueryFailedError: update or delete on table "lsp_details" violates foreign key constraint "FK_9a5ae482b5c6573ba5f0045400a" on table "training_details"`
      // ) {
      //   throw new BadRequestException({ message: 'Unable to remove learning service provider' });
      // }
      // throw new BadRequestException();
      // if (
      //   error.message.includes(
      //     `QueryFailedError: update or delete on table "lsp_details" violates foreign key constraint "FK_9a5ae482b5c6573ba5f0045400a" on table "training_details`
      //   )
      // ) {
      //   throw new BadRequestException(error, { cause: new Error() });
      // } else {
      //   throw new BadRequestException();
      // }
    }
  }

  // delete lsp components by id
  async deleteLspComponentsById(id: string, entityManager: EntityManager) {
    try {
      const affiliations = await this.lspAffiliationsService.delete(id, entityManager);
      const awards = await this.lspAwardsService.delete(id, entityManager);
      const certifications = await this.lspCertificationsService.delete(id, entityManager);
      const coachings = await this.lspCoachingsService.delete(id, entityManager);
      const educations = await this.lspEducationsService.delete(id, entityManager);
      const projects = await this.lspProjectsService.delete(id, entityManager);
      const trainings = await this.lspTrainingsService.delete(id, entityManager);

      const result = await Promise.all([affiliations, awards, certifications, coachings, educations, projects, trainings]);

      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
