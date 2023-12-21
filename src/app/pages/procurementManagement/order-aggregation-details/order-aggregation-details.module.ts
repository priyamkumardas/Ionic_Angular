import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderAggregationDetailsPageRoutingModule } from './order-aggregation-details-routing.module';

import { OrderAggregationDetailsPage } from './order-aggregation-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderAggregationDetailsPageRoutingModule
  ],
  declarations: [OrderAggregationDetailsPage]
})
export class OrderAggregationDetailsPageModule {}
