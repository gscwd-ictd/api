import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { PurchaseRequestDetails } from '../data/purchase-request-details';
import { RequestedItem } from '../data/requested-item';

@ViewEntity({
  name: 'for_rfq_items_view',
  expression: (datasource: DataSource) =>
    datasource
      .createQueryBuilder()
      .select('item.requested_item_id', 'requested_item_id')
      .addSelect('item.pr_details_id_fk', 'pr_id')
      .addSelect('pr.code', 'pr_code')
      .from(RequestedItem, 'item')
      .innerJoin(PurchaseRequestDetails, 'pr')
      .where('item.rfq_details_id_fk IS NULL'),
})
export class RequestedItemsForRfqView {
  @ViewColumn()
  requested_item_id: string;

  @ViewColumn()
  pr_id: string;

  @ViewColumn()
  pr_code: string;
}
