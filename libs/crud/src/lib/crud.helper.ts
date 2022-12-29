import { CrudService } from '../../../crud/src/lib/crud.service';
import { ErrorResult } from '../../../crud/src/lib/crud.utils';
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral } from 'typeorm';

export abstract class CrudHelper<T extends ObjectLiteral> {
  constructor(private readonly crud: CrudService<T>) {}

  async create(data: DeepPartial<T>, error?: (error: Error) => ErrorResult) {
    return await this.crud.create(data, error);
  }

  async findAll(options?: FindManyOptions<T>) {
    return await this.crud.findAll(options);
  }

  async findAllBy(options: FindOptionsWhere<T>) {
    return await this.crud.findAllBy(options);
  }

  async findOne(options: FindOneOptions<T>, error?: (error: Error) => ErrorResult) {
    return await this.crud.findOne(options, error);
  }

  async findOneBy(options: FindOptionsWhere<T>, error?: (error: Error) => ErrorResult) {
    return await this.crud.findOneBy(options, error);
  }

  async update(options: FindOptionsWhere<T>, data: DeepPartial<T>, error?: (error: Error) => ErrorResult) {
    return await this.crud.update(options, data, error);
  }

  async delete(options: FindOptionsWhere<T>, error?: (error: Error) => ErrorResult) {
    return await this.crud.delete(options, error);
  }

  async getRepository() {
    return this.crud.getRepository();
  }
}
