import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectedLanguagePageRoutingModule } from './selected-language-routing.module';
import { SelectedLanguagePage } from './selected-language.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectedLanguagePageRoutingModule,
    PipeModule,
  ],
  declarations: [SelectedLanguagePage]
})
export class SelectedLanguagePageModule {}
