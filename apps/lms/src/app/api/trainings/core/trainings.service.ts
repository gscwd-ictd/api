import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingDto, Training, UpdateTrainingDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TrainingDistributionsService } from '../components/training-distributions';
import { TrainingTagsService } from '../components/training-tags/core/training-tags.service';

@Injectable()
export class TrainingsService extends CrudHelper<Training> {
  constructor(
    private readonly crudService: CrudService<Training>,
    private readonly trainingDistributionService: TrainingDistributionsService,
    private readonly trainingTagsService: TrainingTagsService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  //HR create trainings and distribute slots to selected managers
  async addTraining(dto: CreateTrainingDto) {
    try {
      //transaction results
      const results = await this.datasource.transaction(async (entityManager) => {
        //deconstruct dto
        const { courseContent, nomineeQualifications, trainingDistribution, ...rest } = dto;

        //insert training details
        const training = await this.crudService.transact<Training>(entityManager).create({
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
          },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        //insert multiple and map training tag
        const tag = await Promise.all(
          nomineeQualifications.map(async (tagItem) => {
            return await this.trainingTagsService.addTrainingTag(
              {
                training: training,
                ...tagItem,
              },
              entityManager
            );
          })
        );

        //insert multiple and map selected managers and given number of slots
        const distribution = await Promise.all(
          trainingDistribution.map(async (distributionItem) => {
            return await this.trainingDistributionService.addTrainingDistribution(
              {
                training: training,
                ...distributionItem,
              },
              entityManager
            );
          })
        );

        return {
          ...training,
          courseContent: JSON.parse(training.courseContent),
          nomineeQualifications: tag,
          trainingDistribution: distribution,
        };
      });

      //return training training and distribution transaction result
      return results;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  //get training details by id
  async getTrainingDetailsById(trainingId: string) {
    try {
      //deconstruct results
      const { courseContent, ...rest } = await this.crudService.findOne({
        find: {
          relations: { lspDetails: true, trainingSource: true, trainingType: true, trainingTag: true },
          select: {
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            id: true,
            location: true,
            courseTitle: true,
            trainingStart: true,
            trainingEnd: true,
            numberOfHours: true,
            deadlineForSubmission: true,
            invitationUrl: true,
            numberOfParticipants: true,
            courseContent: true,
            status: true,
            trainingSource: {
              name: true,
            },
            trainingType: {
              name: true,
            },
            trainingTag: {
              tag: {
                description: true,
              },
            },
            lspDetails: {
              employeeId: true,
              firstName: true,
              middleName: true,
              lastName: true,
            },
          },
          where: { id: trainingId },
        },
      });

      //return result and parse course content and nominee qualifications
      return {
        ...rest,
        courseContent: JSON.parse(courseContent),
      };
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  // async getNomineeByTrainingId(trainingId: string) {
  //   try {
  //     const results = await this.trainingNomineesService.crud().findAll({
  //       find: {
  //         relations: { trainingDistribution: true },
  //         select: { trainingDistribution: { employeeId: true } },
  //         where: { trainingDistribution: { training: { id: trainingId } } },
  //       },
  //     });
  //     return results;
  //   } catch (error) {
  //     throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  //   }
  // }

  //update training details
  async updateTrainingDetails(dto: UpdateTrainingDto) {
    try {
      //transaction results
      const result = await this.datasource.transaction(async (entityManager) => {
        //deconstruct dto
        const { id, courseContent, ...rest } = dto;

        //update training details by training id
        const training = await this.crudService.transact<Training>(entityManager).update({
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
          },
          updateBy: { id },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        return training;
      });

      //return update training details transaction result
      return result;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
