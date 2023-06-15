import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingDto, Training, UpdateTrainingDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TrainingNomineesService } from '../components/training-nominees';
import { TrainingDistributionsService } from '../components/training-distributions';

@Injectable()
export class TrainingsService extends CrudHelper<Training> {
  constructor(
    private readonly crudService: CrudService<Training>,
    private readonly trainingNomineesService: TrainingNomineesService,
    private readonly trainingDistributionService: TrainingDistributionsService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  //HR create trainings and distribute slots to selected managers
  async addTrainings(trainingsDto: CreateTrainingDto) {
    try {
      //transaction results
      const results = await this.datasource.transaction(async (entityManager) => {
        //deconstruct dto
        const { courseContent, nomineeQualifications, trainingDistribution, ...rest } = trainingsDto;

        //insert training details
        const training = await this.crudService.transact<Training>(entityManager).create({
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            nomineeQualifications: JSON.stringify(nomineeQualifications),
          },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        //insert and map selected managers and given number of slots
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
          nomineeQualifications: JSON.parse(training.nomineeQualifications),
          trainingDistribution: distribution,
        };
      });

      //return training training and distribution transaction result
      return results;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  async getTrainingsById(trainingId: string) {
    try {
      const { courseContent, nomineeQualifications, ...rest } = await this.crudService.findOne({ find: { where: { id: trainingId } } });
      return {
        ...rest,
        courseContent: JSON.parse(courseContent),
        nomineeQualifications: JSON.parse(nomineeQualifications),
      };
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  async getNomineeByTrainingId(trainingId: string) {
    try {
      const results = await this.trainingNomineesService.crud().findAll({
        find: {
          relations: { trainingDistribution: true },
          select: { trainingDistribution: { employeeId: true } },
          where: { trainingDistribution: { training: { id: trainingId } } },
        },
      });
      return results;
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  //update training details
  async updateTrainingsDetails(dto: UpdateTrainingDto) {
    try {
      //transaction results
      const result = await this.datasource.transaction(async (entityManager) => {
        //deconstruct dto
        const { id, courseContent, nomineeQualifications, ...rest } = dto;

        //update training details by training id
        const training = await this.crudService.transact<Training>(entityManager).update({
          dto: {
            ...rest,
            courseContent: JSON.stringify(courseContent),
            nomineeQualifications: JSON.stringify(nomineeQualifications),
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
