import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';
import { SharedModule } from 'src/app/components/shared.module';
import { OrderQuantityPageRoutingModule } from './order-quantity-routing.module';

import { OrderQuantityPage } from './order-quantity.page';

@NgModule({
  declarations: [OrderQuantityPage],
  imports: [
    CommonModule,
    BrowserModule,
    SharedModule,
    FormsModule,
    IonicModule,
    OrderQuantityPageRoutingModule,
    PipeModule
  ]
})
export class OrderQuantityPageModule { }
