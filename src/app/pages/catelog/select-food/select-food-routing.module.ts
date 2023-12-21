import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectFoodPage } from './select-food.page';

const routes: Routes = [
  {
    path: '',
    component: SelectFoodPage
  },
  {
    path: 'browse-catalog',
    loadChildren: () => import('./browse-catalog/browse-catalog.module').then( m => m.BrowseCatalogPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectFoodPageRoutingModule {}
