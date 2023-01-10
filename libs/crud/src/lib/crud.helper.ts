import { CrudService } from '../../../crud/src/lib/crud.service';
import { ObjectLiteral } from 'typeorm';

export abstract class CrudHelper<T extends ObjectLiteral> {
  constructor(private readonly crud: CrudService<T>) {}

  public getRepository() {
    return this.crud.getRepository();
  }

  public getProvider() {
    return this.crud;
  }
}
