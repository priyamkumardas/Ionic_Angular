import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from 'src/app/referal/dashboard/dashboard.component';
import { ModalController } from '@ionic/angular';
import { InviteCategoryComponent } from './invite-category/invite-category.component';
import { ReferFormComponent } from './refer-form/refer-form.component';
import { MyReferalComponent } from './my-referal/my-referal.component';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { CommonService } from 'src/app/lib/services/common.service';
import { ReferralRatingComponent } from './referral-rating/referral-rating.component';
import { Router } from '@angular/router';
import { CommonApi } from '../lib/services/api/common.api';
import { ApiUrls } from '../config/constants';
import { NavController } from '@ionic/angular';

declare var cordova;

@Injectable({
  providedIn: 'root',
})
export class ReferralService {
  referral_mgmt = {
    referralInvite: environment.baseUrl + '/ref_ms/apis/v1/ref/invite',
    referrals: environment.baseUrl + '/ref_ms/apis/v1/ref',
    referralReminder: environment.baseUrl + '/ref_ms/apis/v1/ref/sendReminder',
    referralRatings: environment.baseUrl + '/ref_ms/apis/v1/ref/ratings',
  };
  closeModal = [];
  i = 0;
  // Userapplink     = 'https://play.google.com/store/apps/details?id=com.sarvm.hh&hl=en-US&ah=uI6maScqUW8bclH7s_fV8-tJw58';
  // Retailerapplink = 'https://play.google.com/store/apps/details?id=com.sarvm.biz&hl=en-US&ah=uI6maScqUW8bclH7s_fV8-tJw58';
  // Logisticapplink = 'https://play.google.com/store/apps/details?id=com.sarvm.loga&hl=en-US&ah=uI6maScqUW8bclH7s_fV8-tJw58';
  appLink = environment.sarvmAllApps.publicPage

  inviteType = new BehaviorSubject({});
  Individual_Message_BODY = `Hey! Check out SarvM.AI, an app digitizing the food supply chain. Download the app now  ${this.appLink}. Give miss call at  ${environment.refferal.ackPhonenumber}  to acknowledge.`;
  Retailer_Message_BODY = `Hey! Check out SarvM.AI Retailer, an app digitizing the food supply chain. Download the app now  ${this.appLink}. Give miss call at  ${environment.refferal.ackPhonenumber}  to acknowledge.`;
  Logistic_Message_BODY = `Hey! Check out SarvM.AI Logistics app. Download the app now  ${this.appLink}. Give miss call at  ${environment.refferal.ackPhonenumber}  to acknowledge.`;

  constructor(
    private http: HttpClient,
    private toastctrl: ToastController,
    private modalCtrl: ModalController,
    private sms: SMS,
    private androidPermissions: AndroidPermissions,
    public commonService: CommonService,
    private commonApi: CommonApi,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.checkSMSPermission()
    //this.commonService.setUserData()
    //console.log('Flyy segment ID', this.commonService.userData.segmentId)
  }
  closeallModal(x) {
    this.closeModal[this.i] = x;
    this.i++;
  }

  checkSMSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.SEND_SMS).then(
      result => console.log('Has permission?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.SEND_SMS)
    );
  }
  requestSMSPermission() {
    // tslint:disable-next-line: max-line-length
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.SEND_SMS, this.androidPermissions.PERMISSION.BROADCAST_SMS]);
  }

  setInviteeData(data) {
    this.inviteType.next(data);
  }

  async closeReferralModal() {
    console.log(this.closeModal)
    for (var i = 0; i < this.closeModal.length; i++) {
      this.closeModal[i].dismiss();
    }
    this.router.navigate(['/referal/my-referal']);
    // this.navCtrl.setDirection('root');
  }

  async openReferralDashboardModal() {
    const modal = await this.modalCtrl.create({
      component: DashboardComponent,
    });
    this.closeallModal(modal);
    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data === 'invite') {
      this.openInviteModal();
    }
  }

  async openInviteModal() {
    this.commonService.presentProgressBarLoading()
    const modal = await this.modalCtrl.create({
      component: InviteCategoryComponent,
    });
    this.closeallModal(modal);
    modal.present();
    this.commonService.closeProgressBarLoading()
    const { data } = await modal.onWillDismiss();
    if (data === 'refer-form') {
      this.openReferralForm();
    }
    if (data === 'not-available') {
      this.showToast();
      this.openInviteModal();
    }
  }

  async openMyRewardsModal() {
    // this.commonService.presentProgressBarLoading()
    // const modal = await this.modalCtrl.create({
    //   component: MyReferalComponent,
    // });
    // this.closeallModal(modal);
    // modal.present();
    // this.commonService.closeProgressBarLoading()
    // const { data } = await modal.onWillDismiss();
    // console.log(data)
    // if (data === 'confirm') {
    // }
    this.closeReferralModal()
    this.router.navigate(['/referal/my-referal'])
  }

  async openReferralForm() {
    this.commonService.presentProgressBarLoading()
    const modal = await this.modalCtrl.create({
      component: ReferFormComponent,
    });
    this.closeallModal(modal);
    modal.present();
    this.commonService.closeProgressBarLoading()
    const { data } = await modal.onWillDismiss();
    if (data === 'confirm') {
      this.openMyRewardsModal();
    }
  }

  async openRferralRating(number: any, type: string) {
    const modal = await this.modalCtrl.create({
      component: ReferralRatingComponent,
      cssClass: 'DeliveryDayPreference-component-css',
      componentProps: {
        //isModal: true,
        phoneNumber: number,
        referType: type,
      },
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
  }

  sendReferralReminder(phoneNo: any, type: any) {
    var data = {
      phone: phoneNo,
      type: type,
    };
    return this.http.post(this.referral_mgmt.referralReminder, data);
  }

  sendReferralInvite(phoneNo: any, invitee: any) {
    var data = {
      phone: phoneNo,
      type: invitee,
    };
    return this.http.post(this.referral_mgmt.referralInvite, data);
  }

  myReferralsList() {
    return this.http.get(this.referral_mgmt.referrals);
  }

  sendReferralRatings(phone_number, type, ratings, comments: string) {
    var data = {
      phone_number: phone_number,
      type: type,
      ratings: ratings,
      comments: comments
    };
    console.log(data);
    return this.http.put(this.referral_mgmt.referralRatings, data);
  }

  async showToast() {
    await this.toastctrl
      .create({
        message: "Hey! it's not available",
        duration: 2000,
      })
      .then((res) => res.present());
  }
  async showToastNumber() {
    await this.toastctrl
      .create({
        message: "Please enter a valid number.",
        duration: 2000,
      })
      .then((res) => res.present());
  }

  sendSms(phone, message) {
    const options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: 'INTENT'  // send SMS with the native android SMS messaging
        // intent: '' // send SMS without opening any other app
      }
    };
    this.sms.send(phone, message, options).then(() => {
      this.commonService.success('message has been sent');
    })
      .catch(error => {
        this.commonService.danger('Failed: ' + error);
      });
  }

  initFlyy() {
    cordova.plugins.FlyyPlugin.initSdk(environment.flyy_partner_id, environment.flyy_env, function (data) {
      console.log("Init SDK Success: " + data)
    }, function (data) {
      console.log("Init SDK Error : " + data)
    });
  }

  setThemeColor() {
    cordova.plugins.FlyyPlugin.setThemeColor(environment.flyy_theme, environment.flyy_theme, function (data) {
      console.log("Set theme color Success : " + data)
    }, function (data) {
      console.log("Set theme color Error : " + data)
    });
  }

  setAppPackage() {
    cordova.plugins.FlyyPlugin.setAppPackage(environment.package_name, function (data) {
      console.log("Set Package Name: " + data)
    }, function (data) {
      console.log("Set Package Name Error: " + data)
    });
  }

  setUser(user_id, seg_id) {
    // let segment = environment.flyy_ind_segment_id;
    console.log(seg_id);
    cordova.plugins.FlyyPlugin.setUser(user_id, seg_id, function (data) {
      console.log("Set User Success : " + data)
    }, function (data) {
      console.log("Set User Error : " + data)
    });
  }

  setNewUser(user_id) {
    cordova.plugins.FlyyPlugin.setNewUser(user_id, function (data) {
      console.log("Set New User Success : " + data)
    }, function (data) {
      console.log("Set New User Error : " + data)
    });
  }

  setUsername(name) {
    cordova.plugins.FlyyPlugin.setUsername(name, function (data) {
      console.log("Set User Name Success : " + data)
    }, function (data) {
      console.log("Set User Name Error : " + data)
    });
  }

  startWalletActivity() {
    let segmentId = this.commonService.userData.segmentId ? this.commonService.userData.segmentId : 'household';
    cordova.plugins.FlyyPlugin.startRewardsActivity(segmentId, function (data) {
      console.log("Wallet Page Success : " + data)
    }, function (data) {
      console.log("Wallet Page Error : " + data)
    });
  }

}
