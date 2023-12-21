import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectedLanguagePage } from './selected-language.page';

const routes: Routes = [
  {
    path: '',
    component: SelectedLanguagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectedLanguagePageRoutingModule {}
