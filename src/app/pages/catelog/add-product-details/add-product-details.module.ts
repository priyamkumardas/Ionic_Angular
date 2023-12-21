import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProductDetailsPageRoutingModule } from './add-product-details-routing.module';
import { AddProductDetailModelComponent } from 'src/app/components/add-product-detail-model/add-product-detail-model.component';
import { AddProductDetailsPage } from './add-product-details.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    AddProductDetailsPageRoutingModule
  ],
  declarations: [AddProductDetailsPage , AddProductDetailModelComponent]
})
export class AddProductDetailsPageModule {}