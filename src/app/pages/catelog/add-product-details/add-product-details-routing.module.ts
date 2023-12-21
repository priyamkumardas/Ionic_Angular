import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProductDetailsPage } from './add-product-details.page';

const routes: Routes = [
  {
    path: '',
    component: AddProductDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProductDetailsPageRoutingModule {}
