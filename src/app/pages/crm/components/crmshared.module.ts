import { IonicModule } from '@ionic/angular';
 import { CommonModule } from '@angular/common';
 import { NgModule } from '@angular/core';
 
 import { RouterModule } from '@angular/router';
 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { PipeModule } from '../../../lib/pipe/pipes.module';
 import { InviteCustomerModalComponent } from './invite-customer-modal/invite-customer-modal.component';
 
 const COMPONENTS = [
     InviteCustomerModalComponent
 ];
 @NgModule({
   declarations: [
     ...COMPONENTS
   ],
   imports: [
     CommonModule,
     IonicModule,
     RouterModule,
     FormsModule,
     ReactiveFormsModule,
     PipeModule,
   ],
   exports: [
     CommonModule,
     ...COMPONENTS
   ],
 })
 export class CrmSharedModule { }