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

  async rawQuery<T, K>(query: string, parameters?: T[]): Promise<K> {
    return await this.getRepository().query(query, parameters);
  }

  public queryBuilder(alias?: string, runner?: QueryRunner) {
    return this.getRepository().createQueryBuilder(alias, runner);
  }

  /**
   * @deprecated Use a DataSource object directly
   */
  public getDatasource() {
    return this.myCrud.getDatasource();
  }

  /**
   * @deprecated Access EntityManager from DataSource object directly
   */
  public getManager() {
    return this.myCrud.getManager();
  }

  public getEntityTarget() {
    return this.myCrud.getEntityTarget();
  }
}
