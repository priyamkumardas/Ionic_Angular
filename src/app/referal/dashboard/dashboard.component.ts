import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { Constants } from 'src/app/config/constants';
import { CommonService } from 'src/app/lib/services/common.service';
import { StorageService } from 'src/app/lib/services/storage.service';
import { OnboardService } from 'src/app/lib/services/onboard.service';
import { ReferralService } from '../referral.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userId: any = 1; // this will be changed when login is done & actual user id will be there
  referred: any;
  acknowledged: any;
  signedUp: any;
  order: any;
  profileComplete: any;
  maxReward: any;
  base64Url: any
  refCode: any;
  profileUrl: any;
  shopName: any;
  helpVideo: any;

  constructor(
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private referralService: ReferralService,
    public commonservice: CommonService,
    private storageService: StorageService,
    private onboardService: OnboardService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getMyReferrals();
  }

  ionViewWillEnter() {
    this.getShopOwnerDetailsFromLocal();
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  getShopOwnerDetailsFromLocal() {
    this.profileUrl = this.storageService.getItem(Constants.PROFILE_URL);
    this.shopName = this.storageService.getItem(Constants.SHOP_NAME);
    console.warn(this.profileUrl, this.shopName)
  }

  async getMyReferrals() {
    const loading = await this.loadingController.create({
      mode: 'ios',
      spinner: 'circles',
      message: 'Please wait...',
    });
    this.presentLoading(loading);
    this.referralService.myReferralsList().subscribe((res: any) => {
      loading.dismiss()
      this.refCode = res.data.ref_code
      this.referred = parseInt(res['data']['users_invited']) / 100;
      this.acknowledged = parseInt(res['data']['acknowledged']) / 100;
      this.signedUp = parseInt(res['data']['signedup']) / 100;
      this.order = parseInt(res['data']['first_order_completed']) / 100;
      this.profileComplete = parseInt(res['data']['profile_completed']) / 100;
      this.maxReward = res['data']['max_reward'];
    }, (err) => {
      console.log(err);
      loading.dismiss();
      this.commonservice.toast(err.error.error.message);
    });
  }

  async shareQr() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    this.base64Url = canvas.toDataURL('image/jpeg')
    this.commonservice.shareQr(this.profileUrl, this.shopName, this.base64Url)
  }

  downloadQr() {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    const imageData = canvas.toDataURL('image/jpeg')
    this.commonservice.savePicture(imageData, this.refCode)
  }

  openInviteModal() {
    this.router.navigate['/referal/invite-referal']
  }

  action() {
    return this.modalCtrl.dismiss();
  }

  refferalclose() {
    this.referralService.closeReferralModal();
  }

  async openHelpVideo() {
    this.helpVideo = this.storageService.getItem(Constants.HELP_VIDEOS);
    this.commonservice.openHelpVideo(this.helpVideo?.Referral)
  }
}
