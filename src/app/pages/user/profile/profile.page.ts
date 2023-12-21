import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/config/constants';
import { DashboardComponent } from 'src/app/referal/dashboard/dashboard.component';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../../lib/services/common.service';
import { AuthService } from '../../../lib/services/auth.service';
import { GstComponent } from '../../kyc/gst/gst.component';
import { ReferralService } from 'src/app/referal/referral.service'
import { StorageService } from 'src/app/lib/services/storage.service';
import { PaymentService } from 'src/app/lib/services/payment.service';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { OnboardService } from 'src/app/lib/services/onboard.service';
import { LogoutPopUpComponent } from 'src/app/components/logout-pop-up/logout-pop-up.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  subscriptionsStatus: any;
  ionVersionNumber: string;
  appEnvirorment = environment.production
  env_name = environment.env_name
  wantToLogOut;
  shopId: string;
  gstSubmitted: any;
  isSubscribed: any;
  kycVerified: any;
  userDetails: any;
  clickDisable
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    public commonservice: CommonService,
    public authservice: AuthService,
    private storageService: StorageService,
    public refferalservice: ReferralService,
    private paymentService: PaymentService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private onboardService: OnboardService,
  ) {
    /* App Version */
    console.log(this.appEnvirorment)
    this.platform.ready().then(() => {
      if (this.platform.is("android") || (this.platform.is("ios"))) {
        this.commonservice.appCheckUpdate()
      }
    });

  }
  // Refer Banner
  refferalModule() {
    this.router.navigate['/referal']
  }

  ngOnInit() {
    this.checkSubscriptionStatus()
  }

  ionViewWillEnter() {
    this.getShopOwnerDetails()
  }

  getShopOwnerDetails() {
    this.shopId =
      this.commonservice.getUserData() && this.commonservice.getUserData().shopId
        ? this.commonservice.getUserData().shopId : this.storageService.getItem(Constants.SHOP_ID);
    this.onboardService.getShopOwnerDetails(this.shopId ? this.shopId : null).subscribe((shopDetails: any) => {
      this.userDetails = shopDetails;
      this.gstSubmitted = shopDetails.data.shop.GST_no;
      this.kycVerified = shopDetails.data.shop.isKYCVerified;
      this.isSubscribed = shopDetails.data.shop.isSubscribed;
      this.storageService.setItem('Mobile', this.userDetails?.data?.managerDetail?.phone)
      // console.log(this.isSubscribed);
      // if (this.isSubscribed) {
      //   this.storageService.setItem(Constants.ACTIVE_SUBSCRIPTION_FLAG, this.isSubscribed)
      // } else {
      //   this.storageService.setItem(Constants.ACTIVE_SUBSCRIPTION_FLAG, this.isSubscribed)
      // }
    }, error => {
      console.log(error)
    });
  }

  checkSubscriptionStatus() {
    this.commonservice.present();
    const storeId =
      this.commonservice.getUserData() &&
        this.commonservice.getUserData().shopId
        ? this.commonservice.getUserData().shopId
        : this.storageService.getItem(Constants.SHOP_ID)
          ? this.storageService.getItem(Constants.SHOP_ID)
          : this.commonservice.getUserData().userId;
    this.paymentService.checkStatusSubscriptions(storeId).subscribe((statusSubscr: any) => {
      this.commonservice.dismiss();
      if (statusSubscr.success && statusSubscr.data.subscription_status == "ACTIVE") {
        this.subscriptionsStatus = true
      } else {
        this.subscriptionsStatus = false
      }
      this.storageService.setItem(Constants.ACTIVE_SUBSCRIPTION_FLAG, this.subscriptionsStatus)
    }, err => {
      console.log(err);
      this.commonservice.dismiss()
    })
  }

  async openReferralDashboardModal() {
    const modal = await this.modalCtrl.create({
      component: DashboardComponent,
    });
    modal.present();
  }

  async openGstModal() {
    this.clickDisable = 'disableClick';
    const modal = await this.modalCtrl.create({
      component: GstComponent,
      cssClass: 'gst-modal-css',
      componentProps: { isModal: false, }
    });
    await modal.present();
    this.clickDisable = '';
  };

  editProfile() {
    this.router.navigate(['/edit-profile']);
  }

  gotoMyQr() {
    this.router.navigate(['/my-qr']);
  }

  logOutUser() {
    this.commonservice.customAlert('Log Out', 'Are you sure?', () => { this.authservice.logOutUser() }, () => { });
  }
}
