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
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, EntityNotFoundError, QueryFailedError } from 'typeorm';
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
            type: LspType.INDIVIDUAL,
            source: LspSource.INTERNAL,
          },
          onError: (error) => {
            throw error;
          },
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
      if (error.code === '23505' && error instanceof QueryFailedError) {
        // Duplicate key violation
        throw new HttpException('Duplicate Key Violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        // Foreign key constraint violation
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        // Handle other errors as needed
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
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
            type: LspType.INDIVIDUAL,
            source: LspSource.EXTERNAL,
          },
          onError: (error) => {
            throw error;
          },
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
      if (error.code === '23505' && error instanceof QueryFailedError) {
        // Duplicate key violation
        throw new HttpException('Duplicate Key Violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        // Foreign key constraint violation
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        // Handle other errors as needed
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
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
            type: LspType.ORGANIZATION,
            source: LspSource.EXTERNAL,
          },
          onError: (error) => {
            throw error;
          },
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
      if (error.code === '23505' && error instanceof QueryFailedError) {
        // Duplicate key violation
        throw new HttpException('Duplicate Key Violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        // Foreign key constraint violation
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        // Handle other errors as needed
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  //find lsp by id
  async findLspById(id: string) {
    try {
      const lspDetails = await this.crudService.findOneBy({
        findBy: { id },
        onError: () => new NotFoundException(),
      });

      switch (true) {
        case lspDetails.type === LspType.INDIVIDUAL && lspDetails.source === LspSource.INTERNAL:
          return await this.findLspIndividualInternal(id);
        case lspDetails.type === LspType.INDIVIDUAL && lspDetails.source === LspSource.EXTERNAL:
          return await this.findLspIndividualExternal(id);
        case lspDetails.type === LspType.ORGANIZATION && lspDetails.source === LspSource.EXTERNAL:
          return await this.findLspOrganizationExternal(id);
        default:
          return () => new NotFoundException();
      }
    } catch (error) {
      Logger.log(error);
      throw new NotFoundException();
    }
  }

  // find lsp (type = individual, source = internal)
  async findLspIndividualInternal(id: string) {
    try {
      // find lsp details
      const lspDetails = await this.crudService.findOneBy({
        findBy: { id },
        onError: (error) => {
          throw error;
        },
      });

      // find employee details
      const employeeDetails = await this.portalEmployeesService.findEmployeesDetailsById(lspDetails.employeeId);

      // find lsp affiliations
      const affiliations = await this.lspAffiliationsService
        .crud()
        .findAll({ find: { select: { position: true, institution: true }, where: { lspDetails: { id } } } });

      // find lsp coaching
      const coaching = await this.lspCoachingsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      // find lsp projects
      const projects = await this.lspProjectsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      // find lsp trainings
      const trainings = await this.lspTrainingsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      return {
        id: lspDetails.id,
        employeeId: employeeDetails.employeeId,
        name: employeeDetails.fullName,
        sex: employeeDetails.sex,
        contactNumber: employeeDetails.contactNumber,
        email: employeeDetails.email,
        postalAddress: employeeDetails.postalAddress,
        tin: employeeDetails.tin,
        experience: lspDetails.experience,
        introduction: lspDetails.introduction,
        photoUrl: employeeDetails.photoUrl,
        type: lspDetails.type,
        source: lspDetails.source,
        expertise: JSON.parse(lspDetails.expertise),
        affiliations: affiliations,
        awards: employeeDetails.awards,
        certifications: employeeDetails.certifications,
        coaching: coaching,
        education: employeeDetails.education,
        projects: projects,
        trainings: trainings,
      };
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  // find lsp (type = individual, source = external)
  async findLspIndividualExternal(id: string) {
    try {
      // find lsp details by id
      const lspDetails = await this.crudService.findOneBy({
        findBy: { id },
        onError: (error) => {
          throw error;
        },
      });

      // find lsp affiliations
      const affiliations = await this.lspAffiliationsService
        .crud()
        .findAll({ find: { select: { position: true, institution: true }, where: { lspDetails: { id } } } });

      // find lsp awards
      const awards = await this.lspAwardsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      // find lsp certifications
      const certifications = await this.lspCertificationsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      // find lsp coaching
      const coaching = await this.lspCoachingsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      // find lsp education
      const education = await this.lspEducationsService
        .crud()
        .findAll({ find: { select: { degree: true, institution: true }, where: { lspDetails: { id } } } });

      // find lsp projects
      const projects = await this.lspProjectsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      // find lsp trainings
      const trainings = await this.lspTrainingsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      return {
        id: lspDetails.id,
        firstName: lspDetails.firstName,
        middleName: lspDetails.middleName,
        lastName: lspDetails.lastName,
        prefixName: lspDetails.prefixName,
        suffixName: lspDetails.suffixName,
        extensionName: lspDetails.extensionName,
        name: lspDetails.fullName,
        sex: lspDetails.sex,
        contactNumber: lspDetails.contactNumber,
        email: lspDetails.email,
        postalAddress: lspDetails.postalAddress,
        tin: lspDetails.tin,
        experience: lspDetails.experience,
        introduction: lspDetails.introduction,
        photoUrl: lspDetails.photoUrl,
        type: lspDetails.type,
        source: lspDetails.source,
        expertise: JSON.parse(lspDetails.expertise),
        affiliations: affiliations,
        awards: awards,
        certifications: certifications,
        coaching: coaching,
        education: education,
        projects: projects,
        trainings: trainings,
      };
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  // find lsp by id (type = organization, source = external)
  async findLspOrganizationExternal(id: string) {
    try {
      // find lsp details by id
      const lspDetails = await this.crudService.findOneBy({
        findBy: { id },
        onError: (error) => {
          throw error;
        },
      });

      // find lsp affiliations
      const affiliations = await this.lspAffiliationsService
        .crud()
        .findAll({ find: { select: { position: true, institution: true }, where: { lspDetails: { id } } } });

      // find lsp awards
      const awards = await this.lspAwardsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      // find lsp certifications
      const certifications = await this.lspCertificationsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      // find lsp coaching
      const coaching = await this.lspCoachingsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      // find lsp trainings
      const trainings = await this.lspTrainingsService.crud().findAll({ find: { select: { name: true }, where: { lspDetails: { id } } } });

      return {
        id: lspDetails.id,
        name: lspDetails.organizationName,
        contactNumber: lspDetails.contactNumber,
        email: lspDetails.email,
        postalAddress: lspDetails.postalAddress,
        tin: lspDetails.tin,
        experience: lspDetails.experience,
        introduction: lspDetails.introduction,
        photoUrl: lspDetails.photoUrl,
        type: lspDetails.type,
        source: lspDetails.source,
        expertise: JSON.parse(lspDetails.expertise),
        affiliations: affiliations,
        awards: awards,
        certifications: certifications,
        coaching: coaching,
        trainings: trainings,
      };
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  // update lsp by id (type = individual, source = internal)
  async updateLspIndividualInternal(data: UpdateLspIndividualInternalDto) {
    const { id, expertise, affiliations, coaching, projects, trainings, ...rest } = data;

    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // find lsp details by id
        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).findOneBy({
          findBy: { id },
          onError: (error) => {
            throw error;
          },
        });

        // remove lsp child components by id
        await this.removeLspComponentsByLspId(id, false, entityManager);

        // update lsp details by id
        await this.crudService.transact<LspDetails>(entityManager).update({
          updateBy: { id },
          dto: {
            ...rest,
            expertise: JSON.stringify(expertise),
          },
          onError: (error) => {
            throw error;
          },
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

      // return result
      return result;
    } catch (error) {
      Logger.log(error);
      if (error instanceof EntityNotFoundError) {
        // Id not found
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      } else {
        // Handle other errors as needed
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  // update lsp by id (type = individual, source = external)
  async updateLspIndividualExternal(data: UpdateLspIndividualExternalDto) {
    const { id, expertise, affiliations, awards, certifications, coaching, education, projects, trainings, ...rest } = data;

    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // find lsp details by id
        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).findOneBy({
          findBy: { id },
          onError: (error) => {
            throw error;
          },
        });

        // remove lsp child components by id
        await this.removeLspComponentsByLspId(id, true, entityManager);

        // update lsp details by id
        await this.crudService.transact<LspDetails>(entityManager).update({
          updateBy: { id },
          dto: {
            ...rest,
            expertise: JSON.stringify(expertise),
          },
          onError: (error) => {
            throw error;
          },
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
      if (error instanceof EntityNotFoundError) {
        // Id not found
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      } else {
        // Handle other errors as needed
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  // update lsp (type = organization, source = external)
  async updateLspOrganizationExternal(data: UpdateLspOrganizationExternalDto) {
    const { id, expertise, affiliations, awards, certifications, coaching, trainings, ...rest } = data;

    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        // find lsp details by id
        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).findOneBy({
          findBy: { id },
          onError: (error) => {
            throw error;
          },
        });

        // remove lsp child components by id
        await this.removeLspComponentsByLspId(id, true, entityManager);

        // update lsp details by id
        await this.crudService.transact<LspDetails>(entityManager).update({
          updateBy: { id },
          dto: {
            ...rest,
            expertise: JSON.stringify(expertise),
          },
          onError: (error) => {
            throw error;
          },
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
      if (error instanceof EntityNotFoundError) {
        // Id not found
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      } else {
        // Handle other errors as needed
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  // delete lsp by id
  async removeLspById(id: string) {
    try {
      // transaction result
      return await this.datasource.transaction(async (entityManager) => {
        // find lsp details by id
        await this.crudService.transact<LspDetails>(entityManager).findOneBy({
          findBy: { id },
          onError: (error) => {
            throw error;
          },
        });

        // remove lsp components by lsp id
        await this.removeLspComponentsByLspId(id, true, entityManager);

        // remove lsp details by lsp id
        return await this.crudService.transact<LspDetails>(entityManager).delete({
          softDelete: true,
          deleteBy: { id },
          onError: (error) => {
            throw error;
          },
        });
      });
    } catch (error) {
      Logger.log(error);
      if (error instanceof EntityNotFoundError) {
        // Id not found
        throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
      } else {
        // Handle other errors as needed
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  // remove lsp components by lsp id
  async removeLspComponentsByLspId(id: string, softDelete: boolean, entityManager: EntityManager) {
    try {
      const affiliations = await this.lspAffiliationsService.remove(id, softDelete, entityManager);
      const awards = await this.lspAwardsService.remove(id, softDelete, entityManager);
      const certifications = await this.lspCertificationsService.remove(id, softDelete, entityManager);
      const coachings = await this.lspCoachingsService.remove(id, softDelete, entityManager);
      const educations = await this.lspEducationsService.remove(id, softDelete, entityManager);
      const projects = await this.lspProjectsService.remove(id, softDelete, entityManager);
      const trainings = await this.lspTrainingsService.remove(id, softDelete, entityManager);

      return await Promise.all([affiliations, awards, certifications, coachings, educations, projects, trainings]);
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }
}
