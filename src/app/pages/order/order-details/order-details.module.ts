import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { OrderDetailsPageRoutingModule } from './order-details-routing.module';
import { OrderDetailsPage } from './order-details.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';
import { SharedModule } from 'src/app/components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderDetailsPageRoutingModule,
    SharedModule,
    PipeModule,
  ],
  declarations: [OrderDetailsPage]
})
export class OrderDetailsPageModule {}
