import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ZTestService {
  constructor(
    @InjectDataSource('ims')
    private readonly imsDb: DataSource
  ) {}
}
