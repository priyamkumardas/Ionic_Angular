import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KycFormPageRoutingModule } from './kyc-form-routing.module';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';
import { KycFormPage } from './kyc-form.page';
import { GstComponent } from '../gst/gst.component';
import { SharedModule } from "src/app/components/shared.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    KycFormPageRoutingModule,
    PipeModule,
    SharedModule
  ],
  declarations: [KycFormPage, GstComponent],
  entryComponents: [GstComponent]
})
export class KycFormPageModule {}
