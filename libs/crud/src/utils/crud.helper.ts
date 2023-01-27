import { CrudService } from '../lib/crud.service';
import { ObjectLiteral, QueryRunner } from 'typeorm';

export abstract class CrudHelper<T extends ObjectLiteral> {
  constructor(
    // inject crud service
    private readonly myCrud: CrudService<T>
  ) {}

  public crud() {
    return this.myCrud;
  }

  public getRepository() {
    return this.myCrud.getRepository();
  }

  async rawQuery(query: string) {
    return await this.getRepository().query(query);
  }

  public queryBuilder(alias?: string, runner?: QueryRunner) {
    return this.getRepository().createQueryBuilder(alias, runner);
  }

  public getDatasource() {
    return this.myCrud.getDatasource();
  }

  public getManager() {
    return this.getDatasource().manager;
  }
}
