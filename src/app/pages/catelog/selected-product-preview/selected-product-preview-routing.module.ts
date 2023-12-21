import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectedProductPreviewPage } from './selected-product-preview.page';

const routes: Routes = [
  {
    path: '',
    component: SelectedProductPreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectedProductPreviewPageRoutingModule {}
