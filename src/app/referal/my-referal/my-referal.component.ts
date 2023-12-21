import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController, ToastController, LoadingController,InfiniteScrollCustomEvent } from '@ionic/angular';
import { CommonService } from 'src/app/lib/services/common.service';
import { ReferralService } from '../referral.service';
import * as _ from 'lodash';
import { ReferralRatingComponent } from '../referral-rating/referral-rating.component';
import { InviteModalComponent } from '../invite-modal/invite-modal.component';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Constants } from 'src/app/config/constants';
import { StorageService } from 'src/app/lib/services/storage.service';


@Component({
  selector: 'app-my-referal',
  templateUrl: './my-referal.component.html',
  styleUrls: ['./my-referal.component.scss'],
})
export class MyReferalComponent implements OnInit {

  segment;
  userId: any = 1; // this will be changed when login is done & actual user id will be there
  myReferrals: any = [];
  allReferrals: any = [];
  rewardsEarned: any;
  selectedIndex: number = 0;
  subSegmentList = [];
  subSegment;
  selectedSubIndex: number = 2;
  selectedSub = 0;
  filters: any = [];
  phoneNumber: any;
  userCategoryrefferals: any;
  clickDisable
  helpVideo: any;
  isDisable: boolean = false;
  showReferals: any = 5;
  count = [];

  constructor(
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    public referralService: ReferralService,
    public commonService: CommonService,
    private inappBrowser: InAppBrowser,
    private storageService: StorageService,
  ) { }

  ngOnInit() { }

  segmentChanged(ev: any) {
    this.subSegment = '2';
  }

  async userCategorySegmentChange(e: any) {
    this.selectedSub = +e.detail.value;
    this.filters = this.subSegmentList[this.selectedSub].filter;
    this.selectedIndex = 0;
    this.myReferrals = this.subSegmentList[this.selectedSub].details;
    console.log(this.myReferrals);
    this.allReferrals = this.subSegmentList[this.selectedSub].details;
    // console.log(this.allReferrals);
    this.applyFilter(this.subSegmentList[this.selectedSub].filter[0].key, 0)
  }

  ionViewWillEnter() {
    this.segment = '1';
    this.getMyReferrals();
  }

  async presentLoading(loading) {
    return await loading.present();
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
      if (res && res.data) {
        this.rewardsEarned = res['data']['total_reward_recieved'];
        this.subSegmentList = res.data.types ? res.data.types : [];
        if (this.subSegmentList.length) {
          this.filters = this.subSegmentList[this.selectedSub].filter;
          this.allReferrals = this.subSegmentList[this.selectedSub].details;
          this.applyFilter(this.subSegmentList[this.selectedSub].filter[this.selectedIndex ? this.selectedIndex : 0].key, this.selectedIndex ? this.selectedIndex : 0);
        }
      }
    }, (err) => {
      console.log(err);
      loading.dismiss();
      this.commonService.toast(err.error.error.message);
    });
  }

  trackUniqueRefId(index, referal) {
    return referal?.id
  }

  onIonInfinite(ev) {
    // console.log(this.count)
    setTimeout(() => {
      let count = this.showReferals
      this.showReferals += 5;
      this.count = this.count.concat(this.myReferrals.slice(count, this.showReferals));
      // this.count = this.myReferrals.slice(0, this.showReferals);
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 100);
  }

  navtoInvite() {
    this.referralService.openInviteModal();
  }


  async sendReminder(refData: any) {
    this.isDisable = true;
    let msgBody
    if (refData.type == 'INDIVIDUAL') {
      msgBody = this.referralService.Individual_Message_BODY
    }
    if (refData.type == 'RETAILER') {
      msgBody = this.referralService.Retailer_Message_BODY
    }
    if (refData.type == 'LOGISTICS_DELIVERY') {
      msgBody = this.referralService.Logistic_Message_BODY
    }
    const modal = await this.modalCtrl.create({
      component: InviteModalComponent,
      cssClass: 'DeliveryDayPreference-component-css',
    });
    modal.present();
    modal.onDidDismiss().then((data) => {
      this.isDisable = false;
      if (data.data == '1') {
        this.referralService.sendSms(refData.phone_number, msgBody);
      }
      else if (data.data == '0') {
        let url = 'https://wa.me/' + '+91' + refData.phone_number.toString() + '?text=' + msgBody;
        const inappBrowser = this.inappBrowser.create(url, '_system', 'location=no');
      }
    });
  }

  //Optimization needed for filter 
  //1) 1 time processing when get api is called for filtering
  //2) reversing should be avoided (Include it in sort function) 
  applyFilter(filter: any, index: any) {
    console.log(filter)
    this.count = [];
    this.showReferals = 5;
    this.selectedIndex = index;
    let allReffrals = this.allReferrals;
    if (filter != 'ratings') {
      this.myReferrals = allReffrals.filter((v: any, i) => {
        if (v.stages.some((stg) => stg.name.toLowerCase() === filter.toLowerCase() && stg.value)) {
          if (i < 5) {
            this.count.push(v)
          }
          return v;
        }
      });
    } else if (filter == 'ratings') {
      allReffrals.sort(function(a, b) {
        return b.ratings - a.ratings;
      });
      this.myReferrals = allReffrals;
      this.count = this.myReferrals.slice(0, this.showReferals);
    }
  }


  action(arg) {
    this.segment = '0';
    return this.modalCtrl.dismiss(arg);
  }

  // async referralRating(number: any, type: string, rate: any, comments) {
  //   const loading = await this.loadingController.create({
  //     message: 'Please wait...',
  //     cssClass: 'ionLoader',
  //     mode: 'ios'
  //   });
  //   this.presentLoading(loading);
  //   this.isDisable = true
  //   const model = await this.modalCtrl.create({
  //     component: ReferralRatingComponent,
  //     cssClass: 'DeliveryDayPreference-component-css',
  //     componentProps: {
  //       phoneNumber: number,
  //       referType: type,
  //       rating: rate,
  //       comments: comments
  //     },
  //   });
  //   await model.present();
  //   model.onDidDismiss().then((data) => {
  //     this.isDisable = false;
  //     loading.dismiss()
  //     if (data.data != 'close')
  //       this.getMyReferrals();
  //   });
  //   // this.referralService.openRferralRating(number,type);
  // }

  searchNumber() {
    let tempdata = this.myReferrals;
    if (this.myReferrals) {
      if (this.phoneNumber !== '') {
        this.count = tempdata.filter(res => res.masked_phone_number.includes(this.phoneNumber.toLowerCase()))
        this.myReferrals = tempdata.filter(res => res.masked_phone_number.includes(this.phoneNumber.toLowerCase()))
      } else {
        this.applyFilter(this.subSegmentList[this.selectedSub].filter[0].key, 0)
      }
    } else {
      this.applyFilter(this.subSegmentList[this.selectedSub].filter[0].key, 0)
    }
  }

  refferalclose() {
    this.referralService.closeReferralModal();
  }

  async openHelpVideo() {
    this.clickDisable = 'disableClick';
    this.helpVideo = this.storageService.getItem(Constants.HELP_VIDEOS);
    this.commonService.openHelpVideo(this.helpVideo?.Referral)
    this.clickDisable = '';
  }
}
