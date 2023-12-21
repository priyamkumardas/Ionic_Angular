import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderQuantityPage } from './order-quantity.page';

const routes: Routes = [
  {
    path: '',
    component: OrderQuantityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderQuantityPageRoutingModule {}
