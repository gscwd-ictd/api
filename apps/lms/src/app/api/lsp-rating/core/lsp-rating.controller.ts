import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { LspRatingService } from './lsp-rating.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LspRating, UpdateLspRatingDto } from '@gscwd-api/models';
import { FindAllLspRatingInterceptor } from '../misc/interceptors';

@Controller({ version: '1', path: 'lsp' })
export class LspRatingController {
  constructor(private readonly lspRatingService: LspRatingService) {}

  /* find all learning service provider rating by lsp id */
  @UseInterceptors(FindAllLspRatingInterceptor)
  @Get(':lspId/rating')
  async findAllLspRating(
    @Param('lspId') lspId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<LspRating> | LspRating[]> {
    return await this.lspRatingService.crud().findAll({
      find: {
        relations: {
          trainingDetails: {
            trainingDesign: true,
            source: true,
          },
          lspDetails: true,
        },
        where: {
          lspDetails: {
            id: lspId,
          },
        },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':lspId/rating/average')
  async findLspAverageRatingById(@Param('lspId') lspId: string) {
    return await this.lspRatingService.findLspAverageRatingById(lspId);
  }

  /* update learning service provider rating by id */
  @Patch('rating')
  async updateLspRatingById(@Body() data: UpdateLspRatingDto) {
    return await this.lspRatingService.updateLearningServiceProviderRating(data);
  }
}
