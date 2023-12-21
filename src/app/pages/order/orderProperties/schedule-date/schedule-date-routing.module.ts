import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleDatePage } from './schedule-date.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleDatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleDatePageRoutingModule {}
