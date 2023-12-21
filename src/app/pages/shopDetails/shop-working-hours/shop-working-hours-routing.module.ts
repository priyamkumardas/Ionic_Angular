import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopWorkingHoursPage } from './shop-working-hours.page';

const routes: Routes = [
  {
    path: '',
    component: ShopWorkingHoursPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopWorkingHoursPageRoutingModule {}
