import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankFormPageRoutingModule } from './bank-form-routing.module';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';
import { BankFormPage } from './bank-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BankFormPageRoutingModule,
    PipeModule,
  ],
  declarations: [BankFormPage]
})
export class BankFormPageModule {}
