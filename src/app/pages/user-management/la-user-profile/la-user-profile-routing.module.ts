import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaUserProfilePage } from './la-user-profile.page';

const routes: Routes = [
  {
    path: '',
    component: LaUserProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaUserProfilePageRoutingModule {}
