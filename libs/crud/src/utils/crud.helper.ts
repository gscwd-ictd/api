import { CrudService } from '../lib/crud.service';
import { ObjectLiteral } from 'typeorm';

export abstract class CrudHelper<T extends ObjectLiteral> {
  constructor(private readonly myCrud: CrudService<T>) {}

  public crud() {
    return this.myCrud;
  }
}
