import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductListingPageRoutingModule } from './product-listing-routing.module';

import { ProductListingPage } from './product-listing.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    ProductListingPageRoutingModule
  ],
  declarations: [ProductListingPage]
})
export class ProductListingPageModule {}
