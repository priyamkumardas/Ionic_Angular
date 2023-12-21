import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { PipeModule } from 'src/app/lib/pipe/pipes.module';
import { LogoutPopUpComponent } from 'src/app/components/logout-pop-up/logout-pop-up.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MyQrComponent } from './my-qr/my-qr.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    PipeModule,
    QRCodeModule
  ],
  declarations: [
    ProfilePage,
    LogoutPopUpComponent,
    MyQrComponent
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ProfilePageModule { }
