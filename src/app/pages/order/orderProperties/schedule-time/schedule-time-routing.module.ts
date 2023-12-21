import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleTimePage } from './schedule-time.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleTimePageRoutingModule {}
