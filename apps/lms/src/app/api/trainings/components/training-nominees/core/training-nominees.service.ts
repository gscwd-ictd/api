import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { TrainingNominee } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class TrainingNomineesService extends CrudHelper<TrainingNominee> {
  constructor(private readonly crudService: CrudService<TrainingNominee>) {
    super(crudService);
  }

  async FindTrainingNomineeByEmployeeId(id: string) {
    try {
      return;
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
