import { ViewColumn, ViewEntity } from 'typeorm';
import { LspRating } from '../data';

@ViewEntity({
  name: 'lsp_rank_view',
  expression: (datasource) =>
    datasource
      .createQueryBuilder()
      .select('lr.lsp_details_id_fk', 'lspId')
      .addSelect('round(avg(lr.rating),2)', 'average')
      .from(LspRating, 'lr')
      .groupBy('lr.lsp_details_id_fk')
      .orderBy('average', 'DESC'),
})
export class LspRankView {
  @ViewColumn()
  lspId: string;

  @ViewColumn()
  average: number;
}
