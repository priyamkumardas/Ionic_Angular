import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleTimePageRoutingModule } from './schedule-time-routing.module';

import { ScheduleTimePage } from './schedule-time.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    ScheduleTimePageRoutingModule
  ],
  declarations: [ScheduleTimePage]
})
export class ScheduleTimePageModule {}
