import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrowseCatalogPageRoutingModule } from './browse-catalog-routing.module';

import { BrowseCatalogPage } from './browse-catalog.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    BrowseCatalogPageRoutingModule
  ],
  declarations: [BrowseCatalogPage]
})
export class BrowseCatalogPageModule {}
