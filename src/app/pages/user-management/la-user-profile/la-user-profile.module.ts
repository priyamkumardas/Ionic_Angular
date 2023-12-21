import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaUserProfilePageRoutingModule } from './la-user-profile-routing.module';
import { PipeModule } from "../../../lib/pipe/pipes.module";
import { LaUserProfilePage } from './la-user-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaUserProfilePageRoutingModule,
    PipeModule
  ],
  declarations: [LaUserProfilePage]
})
export class LaUserProfilePageModule {}
