import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from '../lib/pipe/pipes.module';
import { DateTimePickerComponent } from 'src/app/components/date-time-picker/date-time-picker.component';
import { EmptyListComponent } from './empty-list/empty-list.component';
import { CancelOrderModalComponent } from '../pages/order/cancel-order-modal/cancel-order-modal.component';
import { BottomTabViewComponent } from './bottom-tab-view/bottom-tab-view.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ScanQrcodeComponent } from '../pages/kyc/bank-form/scan-qrcode/scan-qrcode.component';
import { DispatchModalComponent } from './dispatch-modal/dispatch-modal.component';
import { OrderItemComponent } from '../pages/order/order-item/order-item.component';
import { DeleteQRComponent } from './delete-qr/delete-qr.component';
import { QrScannerComponent } from '../auth/qr-scanner/qr-scanner.component';
import { OrderNotificationComponent } from '../pages/order/order-notification/order-notification.component';
import { HelpVideoComponent } from '../support/help-video/help-video.component';

const COMPONENTS = [
  DateTimePickerComponent,
  EmptyListComponent,
  CancelOrderModalComponent,
  BottomTabViewComponent,
  EditProfileComponent,
  ScanQrcodeComponent,
  DispatchModalComponent,
  OrderItemComponent,
  QrScannerComponent,
  DeleteQRComponent,
  OrderNotificationComponent,
  HelpVideoComponent
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
export class SharedModule { }