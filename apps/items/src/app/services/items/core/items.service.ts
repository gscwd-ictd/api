import { ItemDetailsView } from '@gscwd-api/app-entities';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsService extends CrudHelper<ItemDetailsView> {
  constructor(private readonly crudService: CrudService<ItemDetailsView>) {
    super(crudService);
  }

  // async getAllItemDetails() {
  //   try {
  //     // fetch all data from item details view table
  //     return await this.datasource.getRepository(ItemDetailsView).find();

  //     // catch any resulting error
  //   } catch (error) {
  //     // throw custom rpc exception
  //     throw new MyRpcException({
  //       // send internal server error
  //       code: HttpStatus.INTERNAL_SERVER_ERROR,
  //       details: error,
  //       message: {
  //         error: 'Something went wrong.',
  //         details: error.message,
  //       },
  //     });
  //   }
  // }
}
