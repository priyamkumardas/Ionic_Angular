import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPageRoutingModule } from './order-routing.module';
import { OrderPage } from './order.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';
import { SharedModule } from 'src/app/components/shared.module';
import { OrderContainerComponent } from '../order-container/order-container.component';

@NgModule({
    declarations: [OrderPage, OrderContainerComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OrderPageRoutingModule,
        SharedModule,
        PipeModule,
    ]
})
export class OrderPageModule {}
