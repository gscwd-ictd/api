import { Inject, Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import {
  DataSource,
  DeepPartial,
  DeleteResult,
  EntityTarget,
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CRUD_SERVICE, ErrorResult, FindAllOptions } from '../types/crud.types';

@Injectable()
export class CrudService<T extends ObjectLiteral> {
  // initialize a repository object
  private readonly repository: Repository<T>;

  constructor(
    @Inject(CRUD_SERVICE)
    private readonly entity: EntityTarget<T>,

    // inject datasrouce to target the value of T
    private readonly datasource: DataSource
  ) {
    // get the repository mapped to entity T
    this.repository = datasource.getRepository(entity);
  }

  async create(data: DeepPartial<T>, onError?: (error: Error) => ErrorResult): Promise<T> {
    try {
      // insert a new record into the database
      return await this.repository.save(data);

      // catch any error
    } catch (error) {
      // if errorResult is undefined, throw a generic error
      if (!onError) throw new Error(error);

      // otherwise, throw the resulting error
      throw onError(error);
    }
  }

  async findAll(options?: FindAllOptions<T>): Promise<Pagination<T> | T[]> {
    /**
     * check if options is not defined.
     * perform repository.find() by default.
     */
    if (options === undefined) return await this.repository.find();

    /**
     * check if pagination is not defined but search is defined.
     * perform repository.find() -> passing in search options.
     */
    if (options.search && options.pagination === undefined) return await this.repository.find(options.search);

    // perform search with pagination
    return await paginate<T>(this.repository, options.pagination, options.search);
  }

  async findOne(options: FindOneOptions<T>, onError?: (error: Error) => ErrorResult) {
    try {
      // find one record in the database, and fail this query if it found none
      return await this.repository.findOneOrFail(options);

      // catch any error
    } catch (error) {
      // if errorResult is undefined, throw a generic error
      if (!onError) throw new Error(error);

      // otherwise, throw the resulting error
      throw onError(error);
    }
  }

  async findOneBy(options: FindOptionsWhere<T>, onError?: (error: Error) => ErrorResult): Promise<T> {
    try {
      // find one record in the database, and fail this query if it found none
      return await this.repository.findOneByOrFail(options);

      // catch the resulting error
    } catch (error) {
      // if errorResult is undefined, throw a generic error
      if (!onError) throw new Error(error);

      // otherwise, throw the resulting error
      throw onError(error);
    }
  }

  async update<K extends object>(options: FindOptionsWhere<T>, data: DeepPartial<K>, onError?: (error: Error) => ErrorResult): Promise<UpdateResult> {
    try {
      // update a record in the database
      return await this.repository.update(options, data);

      // catch the resulting error
    } catch (error) {
      // if errorResult is undefined, throw a generic error
      if (!onError) throw new Error(error);

      // otherwise, throw the resulting error
      throw onError(error);
    }
  }

  async delete(options: FindOptionsWhere<T>, onError?: (error: Error) => ErrorResult): Promise<DeleteResult> {
    try {
      // delete a record in the database
      return await this.repository.delete(options);

      // catch the resulting error
    } catch (error) {
      // if errorResult is undefined, throw a generic error
      if (!onError) throw new Error(error);

      // otherwise, throw the resulting error
      throw onError(error);
    }
  }

  public getRepository() {
    return this.repository;
  }
}
