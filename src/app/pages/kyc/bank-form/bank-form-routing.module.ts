import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankFormPage } from './bank-form.page';
import { ScanQrcodeComponent } from './scan-qrcode/scan-qrcode.component';

const routes: Routes = [
  {
    path: '',
    component: BankFormPage
  },
  {
    path: 'select-upi-app',
    loadChildren: () => import('./select-upi-app/select-upi-app.module').then( m => m.SelectUpiAppPageModule)
  },
  {
    path: 'scan-qr-code', component: ScanQrcodeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankFormPageRoutingModule {}
