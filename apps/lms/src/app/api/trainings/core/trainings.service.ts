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

  async addTrainings(trainingsDto: CreateTrainingDto) {
    try {
      const trainings = await this.datasource.transaction(async (entityManager) => {
        const { courseContent, nomineeQualifications, ...rest } = trainingsDto;

        const newTrainings = await this.crudService.transact<Training>(entityManager).create({
          dto: { ...rest, courseContent: JSON.stringify(courseContent), nomineeQualifications: JSON.stringify(nomineeQualifications) },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        return {
          ...newTrainings,
          courseContent: JSON.parse(newTrainings.courseContent),
          nomineeQualifications: JSON.parse(newTrainings.nomineeQualifications),
        };
      });

      return trainings;
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
      const results = await this.trainingNomineesService
        .crud()
        .findAll({
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

  async updateTrainingsDetails(trainingsDto: UpdateTrainingDto) {
    try {
      const trainingResult = await this.datasource.transaction(async (entityManager) => {
        const { id, courseContent, nomineeQualifications, ...rest } = trainingsDto;
        const updateTrainings = await this.crudService.transact<Training>(entityManager).update({
          dto: { ...rest, courseContent: JSON.stringify(courseContent), nomineeQualifications: JSON.stringify(nomineeQualifications) },
          updateBy: { id },
          onError: ({ error }) => {
            return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
          },
        });

        return updateTrainings;
      });
      return trainingResult;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
