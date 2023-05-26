import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingDto, Training } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TrainingsService extends CrudHelper<Training> {
  constructor(private readonly crudService: CrudService<Training>, private readonly datasource: DataSource) {
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
}
