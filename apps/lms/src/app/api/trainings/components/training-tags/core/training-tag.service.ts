import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingTagDto, TrainingTag } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TrainingTagsService extends CrudHelper<TrainingTag> {
  constructor(private readonly crudService: CrudService<TrainingTag>, private readonly dataSource: DataSource) {
    super(crudService);
  }

  //insert multiple tags in a training
  // async addTrainingTags(dto: CreateTrainingTagDto) {
  //   try {

  //     //transaction result
  //     const result = await this.dataSource.transaction(async (entityManager) => {
  //       const { , ...rest } = dto;
  //       return await Promise.all(
  //         employee.map(async (employeeItem) => {
  //           return await this.crudService.transact<TrainingNominee>(entityManager).create({
  //             dto: { ...rest, employeeId: employeeItem },
  //             onError: ({ error }) => {
  //               return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
  //             },
  //           });
  //         })
  //       );
  //     });
  //     return result;
  //   } catch (error) {
  //     return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
  //   }
  // }
}
