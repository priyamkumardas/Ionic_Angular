import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackageListPage } from './package-list.page';

const routes: Routes = [
  {
    path: '',
    component: PackageListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackageListPageRoutingModule {}
