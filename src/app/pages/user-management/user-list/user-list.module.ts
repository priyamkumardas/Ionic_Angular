import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserListPageRoutingModule } from './user-list-routing.module';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';

import { UserListPage } from './user-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeModule,
    IonicModule,
    UserListPageRoutingModule
  ],
  declarations: [UserListPage]
})
export class UserListPageModule { }
