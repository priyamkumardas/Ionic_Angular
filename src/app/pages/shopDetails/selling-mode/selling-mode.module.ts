import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellingModePageRoutingModule } from './selling-mode-routing.module';
import { SellingModePage } from './selling-mode.page';

import { PipeModule } from 'src/app/lib/pipe/pipes.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    SellingModePageRoutingModule
  ],
  declarations: [SellingModePage]
})
export class SellingModePageModule {}
