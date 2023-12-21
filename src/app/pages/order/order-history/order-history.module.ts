import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderHistoryPageRoutingModule } from './order-history-routing.module';
import { OrderHistoryPage } from './order-history.page';

import { PipeModule } from 'src/app/lib/pipe/pipes.module';
import { SharedModule } from 'src/app/components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PipeModule,
    OrderHistoryPageRoutingModule
  ],
  declarations: [OrderHistoryPage]
})
export class OrderHistoryPageModule {}
