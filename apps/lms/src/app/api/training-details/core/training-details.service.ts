import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  CreateTrainingExternalDto,
  CreateTrainingInternalDto,
  TrainingDetails,
  TrainingDistribution,
  TrainingRecommendedEmployee,
  TrainingTag,
} from '@gscwd-api/models';
import { DataSource } from 'typeorm';
import { TrainingTagsService } from '../components/training-tags';
import { TrainingDistributionsService } from '../components/training-distributions';
import { TrainingRecommendedEmployeeService } from '../components/training-recommended-employees';
import { LspDetailsService } from '../../lsp-details';
import { PortalEmployeesService } from '../../../services/portal';

@Injectable()
export class TrainingDetailsService extends CrudHelper<TrainingDetails> {
  constructor(
    private readonly crudService: CrudService<TrainingDetails>,
    private readonly trainingTagsService: TrainingTagsService,
    private readonly trainingDistributionsService: TrainingDistributionsService,
    private readonly trainingRecommendedEmployeesService: TrainingRecommendedEmployeeService,
    private readonly lspDetailsService: LspDetailsService,
    private readonly portalEmployeesService: PortalEmployeesService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  // training internal
  async addTrainingInternal(data: CreateTrainingInternalDto) {
    const { courseContent, trainingRequirements, trainingTags, slotDistribution, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        const trainingDetails = await this.crudService.create({
          dto: {
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            ...rest,
          },
          onError: () => new BadRequestException(),
        });

        //insert training tags
        await Promise.all(
          trainingTags.map(async (trainingTagsItem) => {
            return await this.trainingTagsService.create(
              {
                trainingDetails,
                ...trainingTagsItem,
              },
              entityManager
            );
          })
        );

        //insert training slot distributions
        await Promise.all(
          slotDistribution.map(async (slotDistributionsItem) => {
            return await this.trainingDistributionsService.create(
              {
                trainingDetails,
                ...slotDistributionsItem,
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

  // training external
  async addTrainingExternal(data: CreateTrainingExternalDto) {
    const { courseContent, trainingRequirements, bucketFiles, trainingTags, slotDistribution, ...rest } = data;
    try {
      const result = await this.datasource.transaction(async (entityManager) => {
        const trainingDetails = await this.crudService.create({
          dto: {
            courseContent: JSON.stringify(courseContent),
            trainingRequirements: JSON.stringify(trainingRequirements),
            bucketFiles: JSON.stringify(bucketFiles),
            ...rest,
          },
          onError: () => new BadRequestException(),
        });

        //insert training tags
        await Promise.all(
          trainingTags.map(async (trainingTagsItem) => {
            return await this.trainingTagsService.create(
              {
                trainingDetails,
                ...trainingTagsItem,
              },
              entityManager
            );
          })
        );

        //insert training slot distributions
        await Promise.all(
          slotDistribution.map(async (slotDistributionsItem) => {
            return await this.trainingDistributionsService.create(
              {
                trainingDetails,
                ...slotDistributionsItem,
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

  async findTrainingById(id: string) {
    const trainingDetails = await this.crudService.findOne({
      find: { relations: { trainingDesign: true }, select: { trainingDesign: { id: true } }, where: { id: id } },
      onError: () => new NotFoundException(),
    });

    console.log(trainingDetails);

    switch (true) {
      case trainingDetails.trainingDesign !== null:
        return await this.findTrainingInternalById(id);
      case trainingDetails.trainingDesign === null:
        return await this.findTrainingExternalById(id);
      default:
        return () => new NotFoundException();
    }
  }

  // get training details internal by id
  async findTrainingInternalById(id: string) {
    try {
      const trainingDetails = await this.crudService.findOne({
        find: {
          relations: { trainingDesign: true, trainingSource: true, lspDetails: true },
          select: {
            id: true,
            trainingDesign: { id: true, courseTitle: true },
            courseContent: true,
            location: true,
            trainingStart: true,
            trainingEnd: true,
            numberOfHours: true,
            deadlineForSubmission: true,
            numberOfParticipants: true,
            trainingRequirements: true,
            trainingSource: { id: true, name: true },
            trainingType: true,
            lspDetails: { id: true },
            trainingPreparationStatus: true,
          },
          where: { id: id },
        },
        onError: () => new NotFoundException(),
      });

      const lspDetails = await this.lspDetailsService.findLspDetailsById(trainingDetails.lspDetails.id);

      const tag = (await this.trainingTagsService.crud().findAll({
        find: { relations: { tag: true }, select: { id: true, tag: { name: true } }, where: { trainingDetails: { id } } },
      })) as TrainingTag[];

      const trainingTags = await Promise.all(
        tag.map(async (tagItem) => {
          return {
            tag: tagItem.tag.name,
          };
        })
      );

      const distribution = (await this.trainingDistributionsService.crud().findAll({
        find: { select: { id: true, supervisorId: true, numberOfSlots: true }, where: { trainingDetails: { id } } },
      })) as TrainingDistribution[];

      const slotDistribution = await Promise.all(
        distribution.map(async (distributionItem) => {
          const employees = await this.trainingRecommendedEmployeesService
            .crud()
            .findAll({ find: { select: { employeeId: true }, where: { trainingDistribution: { id: distributionItem.id } } } });

          return {
            supervisor: {
              supervisorId: distributionItem.supervisorId,
            },
            numberOfSlots: distributionItem.numberOfSlots,
            employees,
          };
        })
      );

      return {
        id: trainingDetails.id,
        trainingDesign: trainingDetails.trainingDesign.id,
        lspDetails,
        courseTitle: trainingDetails.trainingDesign.courseTitle,
        courseContent: JSON.parse(trainingDetails.courseContent),
        location: trainingDetails.location,
        trainingStart: trainingDetails.trainingStart,
        trainingEnd: trainingDetails.trainingEnd,
        numberOfHours: trainingDetails.numberOfHours,
        deadlineForSubmission: trainingDetails.deadlineForSubmission,
        numberOfParticipants: trainingDetails.numberOfParticipants,
        trainingRequirements: JSON.parse(trainingDetails.trainingRequirements),
        trainingSource: trainingDetails.trainingSource.name,
        trainingType: trainingDetails.trainingType,
        preparationStatus: trainingDetails.trainingPreparationStatus,
        trainingTags,
        slotDistribution,
      };
    } catch (error) {
      Logger.log(error);
      throw new NotFoundException();
    }
  }

  // get training details external by id
  async findTrainingExternalById(id: string) {
    try {
      const trainingDetails = await this.crudService.findOne({
        find: {
          relations: { trainingSource: true, lspDetails: true },
          select: {
            id: true,
            courseTitle: true,
            courseContent: true,
            location: true,
            trainingStart: true,
            trainingEnd: true,
            numberOfHours: true,
            deadlineForSubmission: true,
            numberOfParticipants: true,
            trainingRequirements: true,
            bucketFiles: true,
            trainingSource: { id: true, name: true },
            trainingType: true,
            trainingPreparationStatus: true,
            lspDetails: { id: true },
          },
          where: { id: id },
        },
        onError: () => new NotFoundException(),
      });

      const lspDetails = await this.lspDetailsService.findLspDetailsById(trainingDetails.lspDetails.id);

      const tag = (await this.trainingTagsService.crud().findAll({
        find: { relations: { tag: true }, select: { id: true, tag: { name: true } }, where: { trainingDetails: { id } } },
      })) as TrainingTag[];

      const trainingTags = await Promise.all(
        tag.map(async (tagItem) => {
          return {
            tag: tagItem.tag.name,
          };
        })
      );

      const distribution = (await this.trainingDistributionsService.crud().findAll({
        find: { select: { id: true, supervisorId: true, numberOfSlots: true }, where: { trainingDetails: { id } } },
      })) as TrainingDistribution[];

      const slotDistribution = await Promise.all(
        distribution.map(async (distributionItem) => {
          const employees = await this.trainingRecommendedEmployeesService
            .crud()
            .findAll({ find: { select: { employeeId: true }, where: { trainingDistribution: { id: distributionItem.id } } } });

          return {
            supervisor: {
              supervisorId: distributionItem.supervisorId,
            },
            numberOfSlots: distributionItem.numberOfSlots,
            employees,
          };
        })
      );

      return {
        id: trainingDetails.id,
        lspDetails,
        courseTitle: trainingDetails.courseTitle,
        courseContent: JSON.parse(trainingDetails.courseContent),
        location: trainingDetails.location,
        trainingStart: trainingDetails.trainingStart,
        trainingEnd: trainingDetails.trainingEnd,
        numberOfHours: trainingDetails.numberOfHours,
        deadlineForSubmission: trainingDetails.deadlineForSubmission,
        numberOfParticipants: trainingDetails.numberOfParticipants,
        trainingRequirements: JSON.parse(trainingDetails.trainingRequirements),
        bucketFiles: JSON.parse(trainingDetails.bucketFiles),
        trainingSource: trainingDetails.trainingSource.name,
        trainingType: trainingDetails.trainingType,
        preparationStatus: trainingDetails.trainingPreparationStatus,
        trainingTags,
        slotDistribution,
      };
    } catch (error) {
      Logger.log(error);
      throw new NotFoundException();
    }
  }

  // find recommended employees by supervisor id
  async findTrainingRecommendedEmployeeBySupervisorId(supervisorId: string) {
    try {
      const distribution = (await this.trainingDistributionsService.crud().findAll({
        find: {
          relations: { trainingDetails: true },
          select: {
            id: true,
            supervisorId: true,
            numberOfSlots: true,
            trainingDetails: {
              id: true,
            },
          },
          where: { supervisorId },
        },
      })) as Array<TrainingDistribution>;

      const trainingDetails = await Promise.all(
        distribution.map(async (distributionItem) => {
          const { trainingDetails } = distributionItem;
          const training = await this.crudService.findOne({
            find: {
              relations: { trainingDesign: true },
              select: {
                id: true,
                courseTitle: true,
                trainingDesign: { courseTitle: true },
                location: true,
                trainingStart: true,
                trainingEnd: true,
                trainingPreparationStatus: true,
              },
              where: { id: trainingDetails.id },
            },
          });

          const employees = (await this.trainingRecommendedEmployeesService.crud().findAll({
            find: { select: { employeeId: true }, where: { trainingDistribution: { id: distributionItem.id } } },
          })) as Array<TrainingRecommendedEmployee>;

          const recommended = await Promise.all(
            employees.map(async (items) => {
              const name = await this.portalEmployeesService.findEmployeesDetailsById(items.employeeId);
              return {
                employeeId: items.employeeId,
                name: name.fullName,
              };
            })
          );
          return {
            id: training.id,
            courseTitle: training.courseTitle || training.trainingDesign.courseTitle,
            location: training.location,
            trainingStart: training.trainingStart,
            trainingEnd: training.trainingEnd,
            preparationStatus: training.trainingPreparationStatus,
            numberOfSlots: distributionItem.numberOfSlots,
            recommended,
          };
        })
      );

      return trainingDetails;
    } catch (error) {
      Logger.log(error);
      throw new BadRequestException();
    }
  }
}
