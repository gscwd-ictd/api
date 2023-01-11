import { CrudService } from '../lib/crud.service';
import { ObjectLiteral } from 'typeorm';

export abstract class CrudHelper<T extends ObjectLiteral> {
  constructor(private readonly crud: CrudService<T>) {}

  public getProvider() {
    return this.crud;
  }
}
