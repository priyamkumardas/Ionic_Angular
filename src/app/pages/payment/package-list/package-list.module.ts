import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackageListPageRoutingModule } from './package-list-routing.module';
import { PackageListPage } from './package-list.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackageListPageRoutingModule,
    PipeModule,
  ],
  declarations: [PackageListPage]
})
export class PackageListPageModule {}
