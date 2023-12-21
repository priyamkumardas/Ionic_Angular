import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopAddressPage } from './shop-address.page';

const routes: Routes = [
  {
    path: '',
    component: ShopAddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopAddressPageRoutingModule {}
