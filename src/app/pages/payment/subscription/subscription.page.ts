import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/config/constants';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Checkout } from 'capacitor-razorpay';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/lib/services/common.service';
import { PaymentService } from 'src/app/lib/services/payment.service';
import { Location } from '@angular/common';
import { DataUtils } from 'src/app/lib/utils/data.utils';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { InvoicePage } from '../invoice/invoice.page';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  allSubscription: any;
  @Input() isModal: boolean;

  constructor(private router: Router,
    private ngLocation: Location,
    private commonService: CommonService,
    private paymentService: PaymentService,
    private modalCtrl: ModalController,
    private storageService: StorageService) {
  }

  ngOnInit() {
    this.getAllSubscription();
  }

  getAllSubscription() {
    let shopId = this.storageService.getItem(Constants.SHOP_ID) ? this.storageService.getItem(Constants.SHOP_ID) : this.commonService.userData.shopId
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.paymentService.getAllSubscriptions(shopId).subscribe((allSubscrip: any) => {
        loading.dismiss()
        if ((allSubscrip?.success) && (allSubscrip?.data && allSubscrip?.data?.subscriptionDetails && allSubscrip?.data?.subscriptionDetails.length != 0)) {
          console.log(allSubscrip);
          this.allSubscription = allSubscrip.data;
        } else {
          loading.dismiss()
        }
      }, error => {
        console.log(error)
        loading.dismiss()
      });
    })
  }

  selectSubscripItem(ind) {
    console.log(this.allSubscription?.subscriptionDetails[ind]);
    if ((ind != null && ind != undefined) && (this.allSubscription?.subscriptionDetails.length != 0)) {
      if (this.isModal) {
        this.modalCtrl.dismiss();
        //this.openInvoiceModal(btoa(JSON.stringify(this.allSubscription?.subscriptionDetails[ind])));
        this.router.navigate(['/invoice', btoa(JSON.stringify(this.allSubscription?.subscriptionDetails[ind]))]);
      } else {
        //this.openInvoiceModal(btoa(JSON.stringify(this.allSubscription?.subscriptionDetails[ind])));
        this.router.navigate(['/invoice', btoa(JSON.stringify(this.allSubscription?.subscriptionDetails[ind]))]);
      }
    }
  }

  onBack() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
      this.router.navigate(['/home']);
    } else {
      this.ngLocation.back();
    }
  }

  routetoHome() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/home']);
    }
  }
  async openInvoiceModal(invoiceData) {
    const modal = await this.modalCtrl.create({
      component: InvoicePage,
      cssClass: 'bottomModal',
      componentProps: {
        isModal: true,
        data: invoiceData,
      },
    });
    await modal.present();
  };

  routeToHome() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['home']);
    }
  }
}
