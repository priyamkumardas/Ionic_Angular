import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderAggregationDetailsPage } from './order-aggregation-details.page';

const routes: Routes = [
  {
    path: '',
    component: OrderAggregationDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderAggregationDetailsPageRoutingModule {}
