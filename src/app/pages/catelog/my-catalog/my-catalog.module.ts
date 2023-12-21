import { PipeModule } from 'src/app/lib/pipe/pipes.module';
import { MyCatalogComponent } from './my-catalog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyCatalogRoutingModule } from './my-catalog-routing.module';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SelectCategoryPage } from "src/app/pages/catelog/select-category/select-category.page";
import { SharedModule } from 'src/app/components/shared.module';
import { ProductCardComponent } from '../product-card/product-card.component';


@NgModule({
  declarations: [MyCatalogComponent, ProductCardComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipeModule,
    MyCatalogRoutingModule,
    SharedModule,
  ],
  providers: [SelectCategoryPage]

})
export class MyCatalogModule {}
