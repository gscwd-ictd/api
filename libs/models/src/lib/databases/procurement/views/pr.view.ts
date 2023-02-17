// import { DataSource, ViewEntity } from 'typeorm';

// @ViewEntity({
//   name: 'pr_view',
//   expression: (datasource: DataSource) =>
//     datasource
//       .createQueryBuilder()
//       .select('details.request_details_id', 'pr_id')
//       .addSelect('details.code', 'code')
//       .addSelect('details.requesting_office', 'requesting_office')
//       .addSelect('details.purpose', 'purpose')
//       .addSelect('details.place_of_delivery', 'delivery_place')
//       .addSelect('details.status', 'status')
//       .addSelect('details.created_at', 'created_at')
//       .addSelect('details.updated_at', 'updated_at')
//       .addSelect('details.deleted_at', 'deleted_at')
//       .addSelect('items'),
// })
// export class PurchaseRequestsView {}
