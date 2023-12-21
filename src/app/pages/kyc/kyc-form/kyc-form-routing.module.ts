import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KycFormPage } from './kyc-form.page';

const routes: Routes = [
  {
    path: '',
    component: KycFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KycFormPageRoutingModule {}
