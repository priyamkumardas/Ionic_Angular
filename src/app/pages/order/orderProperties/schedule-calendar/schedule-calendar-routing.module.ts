import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleCalendarPage } from './schedule-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleCalendarPageRoutingModule {}
