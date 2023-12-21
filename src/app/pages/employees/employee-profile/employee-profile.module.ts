import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeProfilePageRoutingModule } from './employee-profile-routing.module';

import { EmployeeProfilePage } from './employee-profile.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    EmployeeProfilePageRoutingModule
  ],
  declarations: [EmployeeProfilePage]
})
export class EmployeeProfilePageModule {}
