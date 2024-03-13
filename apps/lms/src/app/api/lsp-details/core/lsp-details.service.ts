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
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { LspAffiliationsService } from '../components/affiliations';
import { LspAwardsService } from '../components/awards';
import { LspCertificationsService } from '../components/certifications';
import { LspCoachingsService } from '../components/coachings';
import { LspEducationsService } from '../components/educations';
import { LspProjectsService } from '../components/projects';
import { LspTrainingsService } from '../components/trainings';
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

  /* find learning service provider by id */
  async findLspById(id: string) {
    try {
      /* check if learning service provider id is existing */
      const lspDetails = await this.crudService.findOneBy({
        findBy: { id },
      });

      switch (true) {
        /* find learning service provider by id (type = individual & source = internal) */
        case lspDetails.type === LspType.INDIVIDUAL && lspDetails.source === LspSource.INTERNAL:
          return await this.findLspIndividualInternalById(id);

        /* find learning service provider by id (type = individual & source = external) */
        case lspDetails.type === LspType.INDIVIDUAL && lspDetails.source === LspSource.EXTERNAL:
          return await this.findLspIndividualExternalById(id);

        /* find learning service provider by id (type = organization & source = external) */
        case lspDetails.type === LspType.ORGANIZATION && lspDetails.source === LspSource.EXTERNAL:
          return await this.findLspOrganizationExternalById(id);

        /* throw not found  */
        default:
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* find learning service provider by id (type = individual & source = internal) */
  async findLspIndividualInternalById(id: string) {
    try {
      /* find learning service provider details */
      const lspDetails = await this.crudService.findOneBy({
        findBy: { id },
      });

      /*  find employee details by employee */
      const employeeDetails = await this.portalEmployeesService.findEmployeesDetailsById(lspDetails.employeeId);

      /* find all affiliations by learning service provider id */
      const affiliations = await this.lspAffiliationsService.findAllAffiliationsByLspId(lspDetails.id);

      /* find all coaching by learning service provider id */
      const coaching = await this.lspCoachingsService.findAllCoachingByLspId(lspDetails.id);

      /* find all projects by learning service provider id */
      const projects = await this.lspProjectsService.findAllProjectsByLspId(lspDetails.id);

      /* find all trainings by learning service provider id */
      const trainings = await this.lspTrainingsService.findAllTrainingsByLspId(lspDetails.id);

      return {
        createdAt: lspDetails.createdAt,
        updatedAt: lspDetails.updatedAt,
        deletedAt: lspDetails.deletedAt,
        id: lspDetails.id,
        /* employeeId: employeeDetails.employeeId, */
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

  /* find learning service provider by id (type = individual & source = external) */
  async findLspIndividualExternalById(id: string) {
    try {
      /*  find learning service provider details by id */
      const lspDetails = await this.crudService.findOneBy({
        findBy: { id },
      });

      /* find all affiliations by learning service provider id */
      const affiliations = await this.lspAffiliationsService.findAllAffiliationsByLspId(lspDetails.id);

      /* find all awards by learning service provider id */
      const awards = await this.lspAwardsService.findAllAwardsByLspId(lspDetails.id);

      /* find all certifications by learning service provider id */
      const certifications = await this.lspCertificationsService.findAllCertificationsByLspId(lspDetails.id);

      /* find all coaching by learning service provider id */
      const coaching = await this.lspCoachingsService.findAllCoachingByLspId(lspDetails.id);

      /* find all education by learning service provider id */
      const education = await this.lspEducationsService.findAllEducationByLspId(lspDetails.id);

      /* find all projects by learning service provider id */
      const projects = await this.lspProjectsService.findAllProjectsByLspId(lspDetails.id);

      /* find all trainings by learning service provider id */
      const trainings = await this.lspTrainingsService.findAllTrainingsByLspId(lspDetails.id);

      return {
        createdAt: lspDetails.createdAt,
        updatedAt: lspDetails.updatedAt,
        deletedAt: lspDetails.deletedAt,
        id: lspDetails.id,
        /* firstName: lspDetails.firstName,
        middleName: lspDetails.middleName,
        lastName: lspDetails.lastName,
        prefixName: lspDetails.prefixName,
        suffixName: lspDetails.suffixName,
        extensionName: lspDetails.extensionName, */
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
      Logger.error(error);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  /* find learning service provider by id (type = organization & source = external) */
  async findLspOrganizationExternalById(id: string) {
    try {
      /*  find learning service provider details by id */
      const lspDetails = await this.crudService.findOneBy({
        findBy: { id },
      });

      /* find all affiliations by learning service provider id */
      const affiliations = await this.lspAffiliationsService.findAllAffiliationsByLspId(lspDetails.id);

      /* find all awards by learning service provider id */
      const awards = await this.lspAwardsService.findAllAwardsByLspId(lspDetails.id);

      /* find all certifications by learning service provider id */
      const certifications = await this.lspCertificationsService.findAllCertificationsByLspId(lspDetails.id);

      /* find all coaching by learning service provider id*/
      const coaching = await this.lspCoachingsService.findAllCoachingByLspId(lspDetails.id);

      /* find all trainings by learning service provider id */
      const trainings = await this.lspTrainingsService.findAllTrainingsByLspId(lspDetails.id);

      return {
        createdAt: lspDetails.createdAt,
        updatedAt: lspDetails.updatedAt,
        deletedAt: lspDetails.deletedAt,
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
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /*  insert learning service provider (type = individual & source = internal) */
  async createLspIndividualInternal(data: CreateLspIndividualInternalDto) {
    try {
      return await this.datasource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { expertise, affiliations, coaching, projects, trainings, ...rest } = data;

        /* insert learning service provider details */
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

        /* insert affiliations */
        await Promise.all(
          affiliations.map(async (items) => {
            return await this.lspAffiliationsService.createAffiliations({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert coaching */
        await Promise.all(
          coaching.map(async (items) => {
            return await this.lspCoachingsService.createCoachings({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert projects */
        await Promise.all(
          projects.map(async (items) => {
            return await this.lspProjectsService.createProjects({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert trainings */
        await Promise.all(
          trainings.map(async (items) => {
            return await this.lspTrainingsService.createTrainings({ lspDetails, ...items }, entityManager);
          })
        );

        return data;
      });
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        /* Handle other errors as needed */
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* insert learning service provider (type = individual & source = external) */
  async createLspIndividualExternal(data: CreateLspIndividualExternalDto) {
    try {
      return await this.datasource.transaction(async (entityManager) => {
        /* deconstruct data  */
        const { expertise, affiliations, awards, certifications, coaching, education, projects, trainings, ...rest } = data;

        /* insert learning service provider details */
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

        /* insert affiliations */
        await Promise.all(
          affiliations.map(async (items) => {
            return await this.lspAffiliationsService.createAffiliations({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert awards */
        await Promise.all(
          awards.map(async (items) => {
            return await this.lspAwardsService.createAwards({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert certifications */
        await Promise.all(
          certifications.map(async (items) => {
            return await this.lspCertificationsService.createCertifications({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert coaching */
        await Promise.all(
          coaching.map(async (items) => {
            return await this.lspCoachingsService.createCoachings({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert education */
        await Promise.all(
          education.map(async (items) => {
            return await this.lspEducationsService.createEducations({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert projects */
        await Promise.all(
          projects.map(async (items) => {
            return await this.lspProjectsService.createProjects({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert trainings */
        await Promise.all(
          trainings.map(async (items) => {
            return await this.lspTrainingsService.createTrainings({ lspDetails, ...items }, entityManager);
          })
        );

        return data;
      });
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        /* Handle other errors as needed */
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* insert learning service provider (type = organization & source = external) */
  async createLspOrganizationExternal(data: CreateLspOrganizationExternalDto) {
    try {
      return await this.datasource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { expertise, affiliations, awards, certifications, coaching, trainings, ...rest } = data;

        /* insert learning service provider details */
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

        /* insert affiliations */
        await Promise.all(
          affiliations.map(async (items) => {
            return await this.lspAffiliationsService.createAffiliations({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert awards */
        await Promise.all(
          awards.map(async (items) => {
            return await this.lspAwardsService.createAwards({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert certifications */
        await Promise.all(
          certifications.map(async (items) => {
            return await this.lspCertificationsService.createCertifications({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert coaching */
        await Promise.all(
          coaching.map(async (items) => {
            return await this.lspCoachingsService.createCoachings({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert trainings */
        await Promise.all(
          trainings.map(async (items) => {
            return await this.lspTrainingsService.createTrainings({ lspDetails, ...items }, entityManager);
          })
        );

        return data;
      });
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        /*  Handle other errors as needed */
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* edit learning service provider by id (type = individual & source = internal) */
  async updateLspIndividualInternal(data: UpdateLspIndividualInternalDto) {
    try {
      return await this.datasource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { id, expertise, affiliations, coaching, projects, trainings, ...rest } = data;

        /* check learning service provider id */
        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).findOneBy({
          findBy: { id: id },
          onError: (error) => {
            throw error;
          },
        });

        /* edit learning service provider details by id */
        await this.crudService.transact<LspDetails>(entityManager).update({
          updateBy: {
            id: id,
          },
          dto: {
            ...rest,
            expertise: JSON.stringify(expertise),
          },
          onError: (error) => {
            throw error;
          },
        });

        /* remove learning service provider components */
        await this.deleteComponentsByLspId(id, entityManager);

        /* insert affiliations */
        await Promise.all(
          affiliations.map(async (items) => {
            return await this.lspAffiliationsService.createAffiliations({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert coaching */
        await Promise.all(
          coaching.map(async (items) => {
            return await this.lspCoachingsService.createCoachings({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert projects */
        await Promise.all(
          projects.map(async (items) => {
            return await this.lspProjectsService.createProjects({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert trainings */
        await Promise.all(
          trainings.map(async (items) => {
            return await this.lspTrainingsService.createTrainings({ lspDetails, ...items }, entityManager);
          })
        );
      });
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        /*  Handle other errors as needed */
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* edit learning service provider by id (type = individual & source = external) */
  async updateLspIndividualExternal(data: UpdateLspIndividualExternalDto) {
    try {
      return await this.datasource.transaction(async (entityManager) => {
        /* deconstruct data  */
        const { id, expertise, affiliations, awards, certifications, coaching, education, projects, trainings, ...rest } = data;

        /* check learning service provider id */
        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).findOneBy({
          findBy: { id: id },
          onError: (error) => {
            throw error;
          },
        });

        /* edit learning service provider details */
        await this.crudService.transact<LspDetails>(entityManager).update({
          updateBy: { id: id },
          dto: {
            ...rest,
            expertise: JSON.stringify(expertise),
          },
          onError: (error) => {
            throw error;
          },
        });

        /* remove learning service provider components */
        await this.deleteComponentsByLspId(id, entityManager);

        /* insert affiliations */
        await Promise.all(
          affiliations.map(async (items) => {
            return await this.lspAffiliationsService.createAffiliations({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert awards */
        await Promise.all(
          awards.map(async (items) => {
            return await this.lspAwardsService.createAwards({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert certifications */
        await Promise.all(
          certifications.map(async (items) => {
            return await this.lspCertificationsService.createCertifications({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert coaching */
        await Promise.all(
          coaching.map(async (items) => {
            return await this.lspCoachingsService.createCoachings({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert education */
        await Promise.all(
          education.map(async (items) => {
            return await this.lspEducationsService.createEducations({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert projects */
        await Promise.all(
          projects.map(async (items) => {
            return await this.lspProjectsService.createProjects({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert trainings */
        await Promise.all(
          trainings.map(async (items) => {
            return await this.lspTrainingsService.createTrainings({ lspDetails, ...items }, entityManager);
          })
        );

        return data;
      });
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        /* Handle other errors as needed */
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* edit learning service provider by id (type = organization & source = external) */
  async updateLspOrganizationExternal(data: UpdateLspOrganizationExternalDto) {
    try {
      return await this.datasource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { id, expertise, affiliations, awards, certifications, coaching, trainings, ...rest } = data;

        const lspDetails = await this.crudService.transact<LspDetails>(entityManager).findOneBy({
          findBy: { id: id },
          onError: (error) => {
            throw error;
          },
        });

        /* edit learning service provider details */
        await this.crudService.transact<LspDetails>(entityManager).update({
          updateBy: { id: id },
          dto: {
            ...rest,
            expertise: JSON.stringify(expertise),
          },
          onError: (error) => {
            throw error;
          },
        });

        /* remove learning service provider components */
        await this.deleteComponentsByLspId(id, entityManager);

        /* insert affiliations */
        await Promise.all(
          affiliations.map(async (items) => {
            return await this.lspAffiliationsService.createAffiliations({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert awards */
        await Promise.all(
          awards.map(async (items) => {
            return await this.lspAwardsService.createAwards({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert certifications */
        await Promise.all(
          certifications.map(async (items) => {
            return await this.lspCertificationsService.createCertifications({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert coaching */
        await Promise.all(
          coaching.map(async (items) => {
            return await this.lspCoachingsService.createCoachings({ lspDetails, ...items }, entityManager);
          })
        );

        /* insert trainings */
        await Promise.all(
          trainings.map(async (items) => {
            return await this.lspTrainingsService.createTrainings({ lspDetails, ...items }, entityManager);
          })
        );

        return data;
      });
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        /* Duplicate key violation */
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException('Foreign key constraint violation', HttpStatus.BAD_REQUEST);
      } else {
        /*  Handle other errors as needed */
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* remove learning service provider components by id */
  async deleteComponentsByLspId(lspDetailsId: string, entityManager: EntityManager) {
    try {
      const affiliations = await this.lspAffiliationsService.deleteAffiliationsByLspId(lspDetailsId, entityManager);
      const awards = await this.lspAwardsService.deleteAwardsByLspId(lspDetailsId, entityManager);
      const certifications = await this.lspCertificationsService.deleteCertificationsByLspId(lspDetailsId, entityManager);
      const coachings = await this.lspCoachingsService.deleteCoachingsByLspId(lspDetailsId, entityManager);
      const educations = await this.lspEducationsService.deleteEducationsByLspId(lspDetailsId, entityManager);
      const projects = await this.lspProjectsService.deleteProjectsByLspId(lspDetailsId, entityManager);
      const trainings = await this.lspTrainingsService.deleteTrainingsByLspId(lspDetailsId, entityManager);

      return await Promise.all([affiliations, awards, certifications, coachings, educations, projects, trainings]);
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }
}
