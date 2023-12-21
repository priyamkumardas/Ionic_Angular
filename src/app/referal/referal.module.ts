import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'
import { ReferralRatingComponent } from './referral-rating/referral-rating.component';
import { ReferFormComponent } from './refer-form/refer-form.component';
import { MyReferalComponent } from './my-referal/my-referal.component';
import { InviteCategoryComponent } from './invite-category/invite-category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PipeModule } from '../lib/pipe/pipes.module';
import { Routes, RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode'; 
import { FormsModule } from '@angular/forms';
import { InviteModalComponent } from './invite-modal/invite-modal.component';
const routes: Routes =[
  {
    path: 'dashboard',
    component :DashboardComponent
  },
  {
    path: "",
    component : DashboardComponent
  },
  {
    path: "invite-referal",
    component : InviteCategoryComponent
  },
  {
    path: "my-referal",
    component : MyReferalComponent
  },
  {
    path: "referal-ratting",
    component : ReferralRatingComponent
  },
  {
    path: "invite-screen",
    component : InviteModalComponent
  },
]

@NgModule({
  declarations: [
    ReferralRatingComponent,
    ReferFormComponent,
    MyReferalComponent,
    InviteCategoryComponent,
    DashboardComponent,
    InviteModalComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    QRCodeModule,
    RouterModule.forChild(routes),
    PipeModule,
    FormsModule
  ],
  exports : [RouterModule],
})
export class ReferalModule { }
