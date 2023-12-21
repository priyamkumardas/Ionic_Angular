import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleCalendarPageRoutingModule } from './schedule-calendar-routing.module';

import { ScheduleCalendarPage } from './schedule-calendar.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    ScheduleCalendarPageRoutingModule
  ],
  declarations: [ScheduleCalendarPage]
})
export class ScheduleCalendarPageModule {}
