import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/components/shared.module';

import { IonicModule } from '@ionic/angular';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';
import { CustomerDetailPageRoutingModule } from './customer-detail-routing.module';

import { CustomerDetailPage } from './customer-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerDetailPageRoutingModule,
    SharedModule,
    PipeModule,
  ],
  declarations: [CustomerDetailPage]
})
export class CustomerDetailPageModule {}
