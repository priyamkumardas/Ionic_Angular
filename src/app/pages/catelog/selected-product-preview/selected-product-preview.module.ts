import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectedProductPreviewPageRoutingModule } from './selected-product-preview-routing.module';

import { SelectedProductPreviewPage } from './selected-product-preview.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    SelectedProductPreviewPageRoutingModule
  ],
  declarations: [SelectedProductPreviewPage]
})
export class SelectedProductPreviewPageModule {}
