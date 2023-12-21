import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductPricingPageRoutingModule } from './product-pricing-routing.module';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

import { ProductPricingPage } from './product-pricing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductPricingPageRoutingModule,
    PipeModule,
  ],
  declarations: [ProductPricingPage]
})
export class ProductPricingPageModule {}
