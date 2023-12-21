import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleDatePageRoutingModule } from './schedule-date-routing.module';

import { ScheduleDatePage } from './schedule-date.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    ScheduleDatePageRoutingModule
  ],
  declarations: [ScheduleDatePage]
})
export class ScheduleDatePageModule {}
