import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BenchmarkService } from './benchmark.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Benchmark, CreateBenchmarkDto } from '@gscwd-api/models';
import { DeleteResult } from 'typeorm';

@Controller({ version: '1', path: 'benchmark' })
export class BenchmarkController {
  constructor(private readonly benchmarkService: BenchmarkService) {}

  /* find all benchmark */
  @Get()
  async findAllBenchmark(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<Benchmark> | Benchmark[]> {
    return await this.benchmarkService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  /* insert a benchmark */
  @Post()
  async createBenchmark(@Body() data: CreateBenchmarkDto): Promise<Benchmark> {
    return await this.benchmarkService.createBenchmark(data);
  }

  /* find a benchmark by id*/
  @Get(':id')
  async findBenchmarkById(@Param('id') id: string): Promise<Benchmark> {
    return await this.benchmarkService.crud().findOneBy({
      findBy: {
        id: id,
      },
      onError: () => new NotFoundException(),
    });
  }

  /* edit a benchmark */
  @Patch(':id')
  async updateBenchmark(@Param('id') id: string, @Body() data: CreateBenchmarkDto) {
    return await this.benchmarkService.updateBenchmark(id, data);
  }

  /* delete a benchmark */
  @Delete(':id  ')
  async deleteBenchmark(@Param('id') id: string): Promise<DeleteResult> {
    return await this.benchmarkService.crud().delete({
      deleteBy: {
        id: id,
      },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
  }
}
