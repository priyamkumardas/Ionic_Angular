import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Constants } from 'src/app/config/constants';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Checkout } from 'capacitor-razorpay';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/lib/services/common.service';
import { PaymentService } from 'src/app/lib/services/payment.service';
import { Location } from '@angular/common';
import { GstComponent } from '../../kyc/gst/gst.component';
import { InvoicePage } from '../invoice/invoice.page';
import { SubscriptionPage } from '../subscription/subscription.page';
import { CommonApi } from 'src/app/lib/services/api/common.api';
import { LanguageService } from 'src/app/lib/services/language.service';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.page.html',
  styleUrls: ['./package-list.page.scss'],
})
export class PackageListPage implements OnInit {

  subscriptionsDetails: any;
  paymentDetails: any;
  statusDetails: any;
  @Input() isModal: boolean;
  packageList: any;
  // check user subscription
  userSubscriptionStatus: boolean = false;
  helpVideo: any;
  constructor(private router: Router,
    private ngLocation: Location,
    public modalCtrl: ModalController,
    public commonService: CommonService,
    private paymentService: PaymentService,
    private storageService: StorageService,
    private commonApi: CommonApi,
    private languageService: LanguageService) { }

  ngOnInit() {
    // console.log(this.isModal);
    this.getSubscriptionsPackageList()
  }

  buyNow() {
    //this.storageService.setItem(Constants.SELLING_TYPE,{"sellingType":type});
    this.router.navigate(['/shop-address']);
  }

  getSubscriptionsPackageList() {
    this.commonService.presentLoader().then(loader => {
      loader.present()
      this.paymentService.getSubscriptionsPackageList().subscribe((res: any) => {
        loader.dismiss();
        if ((res?.success) && (res?.data)) {
          this.getSubscripPackage(res?.data?.url);
        }
      }, (error) => {
        loader.dismiss();
        console.log(error)
      });
    })
  }

  getSubscripPackage(itemUrl) {
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.languageService.selectLanguageCDN(itemUrl).subscribe((res: any) => {
        loading.dismiss()
        this.packageList = res['RA'][0];
        console.log(this.packageList);
      }, error => {
        loading.dismiss()
        console.log(error)
      });
    })
  }


  createSubscription() {
    this.commonService.presentLoading();
    //let shopId=this.storageService.getItem(Constants.SHOP_ID)?this.storageService.getItem(Constants.SHOP_ID):this.commonService.userData.shopId
    this.storageService.getItemWithPromise(Constants.SHOP_ID).then((shopId: any) => {  // get the saved location array
      let data = {
        msid: this.packageList.masterId
      };
      this.initiateSubscriptionApiCall(data);
    })
  }

  initiateSubscriptionApiCall(data) {
    this.paymentService.createSubscriptions(data).subscribe((subscrip: any) => {
      if ((subscrip.success) && (subscrip?.data && subscrip?.data?.orderId)) {
        this.commonService.dissmiss_loading();
        this.subscriptionsDetails = subscrip;
        console.log(this.subscriptionsDetails);
        this.loadCheckout();
      } else {
        this.storageService.setItem(Constants.ACTIVE_SUBSCRIPTION_FLAG, this.userSubscriptionStatus)
        this.commonService.dissmiss_loading();
      }
    });
  }

  skip() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
    }
    this.router.navigate(['/home']);
  }

  async loadCheckout() {
    if (this.subscriptionsDetails?.data) {
      const options = {
        key: environment.razorpay.razorpay_key,
        //key_secret: environment.razorpay.razorpay_key_secret,
        order_id: this.subscriptionsDetails?.data?.orderId,
        amount: environment.razorpay.razorpay_amount,
        description: 'Subscription',
        image: (Constants.PAY_IMAGE),
        currency: Constants.CURRENCY,
        name: environment.app_name_test,
        prefill: { email: `${this.commonService.userData.shopUniqueId}@sarvm.ai`, contact: `+91${this.commonService.userData.shopUniqueId}` },
        readonly: { email: true, contact: true },
        hidden: { email: true, contact: true },
        theme: { color: environment.app_primary_color_code }
      }
      try {
        Checkout.open(options).then((payRes: any) => {
          console.log(JSON.stringify(payRes));
          if (payRes.response) {
            this.paymentDetails = payRes.response;
            this.checkConfirmSubscriptions();
          }
        }, err => {
          let errorObj = JSON.parse(err['code'])
          this.commonService.danger(errorObj.description);
        });
        //console.log(data.response+"AcmeCorp");
      } catch (error) {
        //it's paramount that you parse the data into a JSONObject
        let errorObj = JSON.parse(error['code'])
        alert(errorObj.description);
        alert(errorObj.code);
        alert(errorObj.reason);
        alert(errorObj.step);
        alert(errorObj.source);
        alert(errorObj.metadata.order_id);
        alert(errorObj.metadata.payment_id);
      }
    }
  }

  closePackageListModal() {
    this.modalCtrl.dismiss();
  }

  checkConfirmSubscriptions() {
    this.commonService.present();
    if (this.paymentDetails) {
      this.paymentDetails['razorpay_payment_signature'] = this.paymentDetails['razorpay_signature'];
      delete this.paymentDetails['razorpay_signature'];
      const subsctiptInfo = this.paymentDetails;
      Object.assign(subsctiptInfo, { "subscriptionId": this.subscriptionsDetails.data.subscriptionId,
      "shopId": this.subscriptionsDetails.data?.shopId,
      "entityType": this.subscriptionsDetails.data?.entityType,
      "entityId": this.subscriptionsDetails.data?.entityId,
      "masterId": this.subscriptionsDetails.data?.masterId })

      this.paymentService.confirmSubscriptions(subsctiptInfo).subscribe((subscrStatus: any) => {
        this.commonService.dismiss();
        if (subscrStatus?.success && subscrStatus?.data?.subscriptionId) {
          this.statusDetails = subscrStatus;
          console.log(subscrStatus);
          this.userSubscriptionStatus = true;
          this.storageService.setItem(Constants.ACTIVE_SUBSCRIPTION_FLAG, this.userSubscriptionStatus)
          if (this.isModal) {
            this.closePackageListModal();
            this.openSubscriptionModal();
            // this.router.navigate(['/subscription']);
          } else {
            this.router.navigate(['/subscription']);
          }
        } else {
          this.commonService.dismiss();
        }
      }, err => {
        console.log(err)
        this.commonService.dismiss();
      });
    }
  }

  onBack() {
    if (this.isModal) {
      this.closePackageListModal();
      this.openGstModal();
    }
  }

  backToHome() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
      this.router.navigate(['/home']);
    } else {
      this.ngLocation.back();
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/home']);
  }

  async openGstModal() {
    const modal = await this.modalCtrl.create({
      component: GstComponent,
      cssClass: 'gst-modal-css'
    });
    await modal.present();
  };


  async openSubscriptionModal() {
    const modal = await this.modalCtrl.create({
      component: SubscriptionPage,
      cssClass: 'bottomModal',
      componentProps: {
        isModal: true,
      },
    });
    await modal.present();
  };

  async openHelpVideo() {
    this.helpVideo = this.storageService.getItem(Constants.HELP_VIDEOS);
    this.commonService.openHelpVideo(this.helpVideo.Onboarding)
   }
}
