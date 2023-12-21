import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellingModePage } from './selling-mode.page';

const routes: Routes = [
  {
    path: '',
    component: SellingModePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellingModePageRoutingModule {}
