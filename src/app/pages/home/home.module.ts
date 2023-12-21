import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/components/shared.module';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    PipeModule,
    SharedModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
