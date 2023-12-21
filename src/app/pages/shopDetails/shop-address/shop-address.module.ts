import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopAddressPageRoutingModule } from './shop-address-routing.module';

import { ShopAddressPage } from './shop-address.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';
import { MapviewComponent } from 'src/app/components/mapview/mapview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipeModule,
    ShopAddressPageRoutingModule
  ],
  declarations: [ShopAddressPage, MapviewComponent]
})
export class ShopAddressPageModule {}
