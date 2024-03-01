import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateDtrCorrectionDto, DtrCorrection } from '@gscwd-api/models';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class DtrCorrectionService extends CrudHelper<DtrCorrection> {
  constructor(private readonly crudService: CrudService<DtrCorrection>) {
    super(crudService);
  }

  async addDtrCorrection(createDtrCorrectionDto: CreateDtrCorrectionDto) {
    return await this.crudService.create({
      dto: createDtrCorrectionDto,
      onError: (error: any) => {
        if (error.error.driverError.code === 'ER_DUP_ENTRY') throw new HttpException('Time log correction already exists.', 406);
        throw new InternalServerErrorException();
      },
    });
  }

  async getDtrCorrections() {
    return '';
  }
}
