import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { EmsSettings } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmsSettingsService extends CrudHelper<EmsSettings> {
  constructor(private readonly crudService: CrudService<EmsSettings>) {
    super(crudService);
  }

  async getMonetizationConstant() {
    return {
      monetizationConstant: Number.parseFloat(
        (await this.crudService.findOne({ find: { select: { value: true }, where: { name: 'monetization_constant' } } })).value
      ),
    };
  }
}
