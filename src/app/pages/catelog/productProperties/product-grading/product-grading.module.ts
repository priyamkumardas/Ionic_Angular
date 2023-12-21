import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductGradingPageRoutingModule } from './product-grading-routing.module';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

import { ProductGradingPage } from './product-grading.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductGradingPageRoutingModule,
    PipeModule,
  ],
  declarations: [ProductGradingPage]
})
export class ProductGradingPageModule {}
