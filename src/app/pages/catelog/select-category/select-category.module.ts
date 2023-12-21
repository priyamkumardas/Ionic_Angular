import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectCategoryPageRoutingModule } from './select-category-routing.module';

import { SelectCategoryPage } from './select-category.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectCategoryPageRoutingModule,
    PipeModule,
  ],
  declarations: [SelectCategoryPage]
})
export class SelectCategoryPageModule {}
