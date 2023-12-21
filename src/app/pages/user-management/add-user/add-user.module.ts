import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddUserPageRoutingModule } from './add-user-routing.module';
import { PipeModule } from "../../../lib/pipe/pipes.module";
import { AddUserPage } from './add-user.page';
@NgModule({
  declarations: [AddUserPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddUserPageRoutingModule,
    PipeModule,
  ],
})
export class AddUserPageModule { }
