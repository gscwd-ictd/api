import { CreateItemSpecificationDto, ItemDetails, ItemSpecification } from '@gscwd-api/app-entities';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { GeneratorService } from '@gscwd-api/generator';
import { MyRpcException } from '@gscwd-api/microservices';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class SpecificationsService extends CrudHelper<ItemSpecification> {
  constructor(
    // inject crud service
    private readonly crudService: CrudService<ItemSpecification>,

    // inject generator service
    private readonly generatorService: GeneratorService
  ) {
    super(crudService);
  }

  async transactionalInsert(data: CreateItemSpecificationDto) {
    // access the datasource object
    const datasource = this.crudService.getDatasource();

    try {
      return await datasource.manager.transaction(async (transactionManager) => {
        // save item specification
        const specification = await transactionManager.save(ItemSpecification, { ...data, code: this.generatorService.generate() as string });

        // save item details
        await transactionManager.save(ItemDetails, { ...data, specification: { id: specification.id } });

        // return the newly created specification
        return specification;
      });

      // catch any resulting error
    } catch (error) {
      // throw a custom rpc exception
      throw new MyRpcException({
        // set status code to 400
        code: HttpStatus.BAD_REQUEST,

        // set details to the actual error
        details: error,

        // set message object
        message: {
          // set error summary
          error: 'Failed to execute transactional insert on item specification and item details',

          // specify error details
          details: error.message,
        },
      });
    }
  }
}
