import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopWorkingHoursPageRoutingModule } from './shop-working-hours-routing.module';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';
import { ShopWorkingHoursPage } from './shop-working-hours.page';
 //import { DateTimePickerComponent } from 'src/app/components/date-time-picker/date-time-picker.component';
 import { SharedModule } from "src/app/components/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopWorkingHoursPageRoutingModule,
    PipeModule,
    SharedModule
  ],
  declarations: [ShopWorkingHoursPage,]
})
export class ShopWorkingHoursPageModule {}
