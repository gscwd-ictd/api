import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Tag } from '@gscwd-api/models';
import { HttpException, HttpStatus, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { HrmsEmployeeTagsService } from '../../../services/hrms';

@Injectable()
export class TagsService extends CrudHelper<Tag> {
  constructor(
    private readonly crudService: CrudService<Tag>,
    @Inject(forwardRef(() => HrmsEmployeeTagsService))
    private readonly hrmsEmployeeTagsService: HrmsEmployeeTagsService
  ) {
    super(crudService);
  }

  /* remove tag by id */
  async deleteTags(id: string) {
    try {
      /* count all tags that have been used by employees */
      const countTag = await this.hrmsEmployeeTagsService.countEmployeeTags(id);

      /* count the number of tags that have been used */
      if (countTag === '0' || countTag === null) {
        /* remove tag */
        return await this.crudService.delete({
          deleteBy: { id: id },
          softDelete: false,
          onError: () => {
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
          },
        });
      } else {
        throw new HttpException('The tag cannot be deleted because it is already in use by another entity.', HttpStatus.CONFLICT);
      }
    } catch (error) {
      Logger.error(error);
      if (error.status == 409) {
        throw new HttpException('The tag cannot be deleted because it is already in use by another entity.', HttpStatus.CONFLICT);
      } else {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
      }
    }
  }
}
