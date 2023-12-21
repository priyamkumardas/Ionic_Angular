import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderAggregationPage } from './order-aggregation.page';

const routes: Routes = [
  {
    path: '',
    component: OrderAggregationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderAggregationPageRoutingModule {}
