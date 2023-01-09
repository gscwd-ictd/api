import { Injectable } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { DataSource } from 'typeorm';
import { UnitOfMeasure } from '../unit/components/unit-of-measure';

@Injectable()
export class TestService {
  constructor(private readonly datasource: DataSource) {}

  async findAll(options: IPaginationOptions) {
    const repository = this.datasource.getRepository(UnitOfMeasure);
    return paginate(repository, options);
  }
}
