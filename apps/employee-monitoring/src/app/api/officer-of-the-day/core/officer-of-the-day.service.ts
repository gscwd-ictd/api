import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { OfficerOfTheDay } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OfficerOfTheDayService extends CrudHelper<OfficerOfTheDay> {
  constructor(private readonly crudService: CrudService<OfficerOfTheDay>) {
    super(crudService);
  }

  async getAll() {
    const officers = await this.crudService.findAll();
  }
}
