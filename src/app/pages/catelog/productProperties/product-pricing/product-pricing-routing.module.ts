import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductPricingPage } from './product-pricing.page';

const routes: Routes = [
  {
    path: '',
    component: ProductPricingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductPricingPageRoutingModule {}
