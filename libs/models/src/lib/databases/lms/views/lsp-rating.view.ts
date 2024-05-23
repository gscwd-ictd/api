import { ViewColumn, ViewEntity } from 'typeorm';
import { LspDetails, LspRating } from '../data';
import { LspSource, LspType } from '@gscwd-api/utils';

@ViewEntity({
  name: 'lsp_rank_view',
  expression: (datasource) =>
    datasource
      .createQueryBuilder()
      .select('ld.lsp_details_id', 'lspId')
      .addSelect('round(avg(lr.rating),2)', 'average')
      .addSelect('ld.lsp_type', 'type')
      .addSelect('ld.lsp_source', 'source')
      .from(LspRating, 'lr')
      .innerJoin(LspDetails, 'ld', 'ld.lsp_details_id = lr.lsp_details_id_fk')
      .groupBy('ld.lsp_details_id')
      .orderBy('average', 'DESC'),
})
export class LspRankView {
  @ViewColumn()
  lspId: string;

  @ViewColumn()
  average: number;

  @ViewColumn()
  source: LspSource;

  @ViewColumn()
  type: LspType;
}
