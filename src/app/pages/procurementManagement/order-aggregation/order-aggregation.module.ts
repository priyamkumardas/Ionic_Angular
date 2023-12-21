import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderAggregationPageRoutingModule } from './order-aggregation-routing.module';

import { OrderAggregationPage } from './order-aggregation.page';
import { PipeModule } from "../../../lib/pipe/pipes.module";

@NgModule({
    declarations: [OrderAggregationPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OrderAggregationPageRoutingModule,
        PipeModule
    ]
})
export class OrderAggregationPageModule {}
