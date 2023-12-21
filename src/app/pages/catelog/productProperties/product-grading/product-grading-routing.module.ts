import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductGradingPage } from './product-grading.page';

const routes: Routes = [
  {
    path: '',
    component: ProductGradingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductGradingPageRoutingModule {}
