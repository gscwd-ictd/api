import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Tag } from '@gscwd-api/models';
import { BadRequestException, HttpException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { HrmsEmployeeTagsService } from '../../../services/hrms';
import { HttpStatusCode } from 'axios';

@Injectable()
export class TagsService extends CrudHelper<Tag> {
  constructor(
    private readonly crudService: CrudService<Tag>,
    @Inject(forwardRef(() => HrmsEmployeeTagsService))
    private readonly hrmsEmployeeTagsService: HrmsEmployeeTagsService
  ) {
    super(crudService);
  }

  async deleteTags(tagId: string) {
    try {
      const count = await this.hrmsEmployeeTagsService.countEmployeeTags(tagId);
      if (count === 0 || count === null) {
        return await this.crudService.delete({
          deleteBy: { id: tagId },
          onError: () => new BadRequestException(),
        });
      } else {
        throw new HttpException('The tag cannot be deleted because it is already in use by another entity.', HttpStatusCode.Conflict);
      }
    } catch (error) {
      Logger.log(error);
      if (error.status == 409) {
        throw new HttpException('The tag cannot be deleted because it is already in use by another entity.', HttpStatusCode.Conflict);
      } else {
        throw new HttpException('Bad Request', HttpStatusCode.BadRequest);
      }
    }
  }
}
