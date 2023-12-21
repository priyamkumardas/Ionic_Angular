import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/lib/services/report.service';
import { CommonService } from '../../../lib/services/common.service';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ModalController, LoadingController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { ReferralRatingComponent } from 'src/app/referal/referral-rating/referral-rating.component';
import { InviteModalComponent } from 'src/app/referal/invite-modal/invite-modal.component';
import { InviteCustomerModalComponent } from '../components/invite-customer-modal/invite-customer-modal.component';
import * as moment from 'moment';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  segment: string;  // for active inactive
  customers: string;
  newSegment: string;

  sDate = moment().subtract(3, 'd').format('YYYY-MM-DD'); //start date 
  eDate = moment().format('YYYY-MM-DD'); // end date 

  allCustomers: any;
  allNewCustomers: any;
  activeNav = '3';
  selectedIndx = 0;
  filters: any = [];
  selectedIndex: number = 0;
  allReferrals: any = [];
  myReferrals: any = [];
  rewardsEarned: any;
  subSegmentList = [];
  selectedSub = 1;  // new 
  clickDisable  // to disable push notification button 
  selectedCustomers = [];
  selectedCustomerPhone = [];
  disabled = true;
  segmentChanges: any;
  msgBody: any

  dateCondition = {
    max: '',
    min: ''
  };
  today;
  format = 'YYYY-MM-DD';
  showReferals: any = 5;
  count = [];

  constructor(
    private reportService: ReportService,
    public commonService: CommonService,
    private router: Router,
    private inappBrowser: InAppBrowser,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
  ) {
    this.segment = "1";
    this.customers = "new";
    this.newSegment = 'incomplete'
  }

  // segmentChanged(ev: any) {
  // }

  ngOnInit() {
    this.getExixtingCustomers(this.sDate, this.eDate);
    this.today = this.getCurrentDate();
    this.dateCondition.max = this.today;
  }

  ionViewWillEnter() {
    // this.segment = '1';
    this.getMyReferrals();
    this.segmentChanges = false;
  }

  getCurrentDate(format: string = 'YYYY-MM-DD') {
    return moment().format(this.format);
  }

  // Send push notifiction to each number
  pushNotification() {
    this.selectedCustomerPhone.forEach((phone) => {

    });
  }
  // change active , inactive 
  segmentChange(segment) {
    console.log(segment)
    this.segmentChanges = true;
    this.disabled = true;
    this.selectedCustomers.length = 0;
    console.log(this.segmentChanges)
  }

  async referToCustomer(phoneNumber) {
    //Modal START
    this.clickDisable = 'disableClick'
    const modal = await this.modalCtrl.create({
      component: InviteCustomerModalComponent,
      cssClass: 'bottomModal',
      componentProps: {
        userPhone: phoneNumber,
      },
    });
    modal.present();
    modal.onDidDismiss().then((data) => {
      this.clickDisable = ''
    })
  }

  getExixtingCustomers(startDate, endDate) {
    this.disabled = true;
    this.selectedCustomers.length = 0;
    this.commonService.presentProgressBarLoading()
    this.reportService.getAllExistingCustomers(startDate, endDate).subscribe((resp: any) => {
      this.commonService.closeProgressBarLoading()
      console.log(resp);
      if (resp.data) {
        console.log('Success');
        this.allCustomers = resp?.data?.topCustomer?.customers;
      }
    }, err => {
      this.commonService.closeProgressBarLoading()
      console.log(err)
      this.commonService.danger(err.error.error.message);
    });
  }

  activeDay(day) {  // filter for date 
    this.activeNav = day;
    if (day == '3' || day == '5' || day == '7') {
      const startDate = moment().subtract(day, 'd').format('YYYY-MM-DD');
      const endDate = moment().format('YYYY-MM-DD');
      this.getExixtingCustomers(startDate, endDate);
    } else {
      const startDate = day.value;
      const endDate = moment().format('YYYY-MM-DD');
      this.getExixtingCustomers(startDate, endDate);
    }
  }

  chooseCustomer(customer, phone) {  // select customer on detail page
    // this.segmentChanges = false
    console.log(this.selectedCustomers.length)
    this.disabled = false;
    if (this.selectedCustomers.filter(res => res === customer).length) {
      let categoryExistsIndexID = this.selectedCustomers.filter(res => res != customer)
      this.selectedCustomers = categoryExistsIndexID
    } else {
      this.selectedCustomers.push(customer)

    }

    // Get all customer numbers
    if (this.selectedCustomerPhone.filter(res => res === phone).length) {
      let customerExistsPhone = this.selectedCustomerPhone.filter(res => res != phone)
      this.selectedCustomerPhone = customerExistsPhone
    } else {
      this.selectedCustomerPhone.push(phone)
    }
    // Disable push notification button if checkbox is unselected
    if (this.selectedCustomers.length == 0) {
      this.disabled = true;
    }
  }

  customerDetails(customerId, userPhoneNumber, userStatus) {
    this.router.navigate(['/customer-detail', customerId, userPhoneNumber, userStatus]);
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

  async getMyReferrals() {
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.reportService.myReferralsList().subscribe((res: any) => {
        if (res && res.data) {
          this.rewardsEarned = res['data']['total_reward_recieved'];
          this.subSegmentList = res.data.types ? res.data.types : [];
          if (this.subSegmentList?.length) {
            console.log("subSegmentList", this.subSegmentList);
            this.filters = this.subSegmentList[this.selectedSub].filter
            this.allReferrals = this.subSegmentList[this.selectedSub].details;
            this.applyFilter(this.subSegmentList[this.selectedSub].filter[this.selectedIndex ? this.selectedIndex : 0].key, this.selectedIndex ? this.selectedIndex : 0);
          }
          loading.dismiss();
        }
      }, (err) => {
        console.log(err);
        loading.dismiss();
        this.commonService.toast(err.error.error.message);
      });
    })
  }

  // async sendReminder(refData: any) {
  //   this.clickDisable = 'disableClick';
  //   this.commonService.presentProgressBarLoading()
  //   let msgBody
  //   if (refData.type == 'INDIVIDUAL') {
  //     msgBody = this.reportService.Individual_Message_BODY
  //   }
  //   if (refData.type == 'RETAILER') {
  //     msgBody = this.reportService.Retailer_Message_BODY
  //   }
  //   const modal = await this.modalCtrl.create({
  //     component: InviteModalComponent,
  //     cssClass: 'referral-rating-modal-css',
  //     componentProps: {
  //       mobileNumber: refData.phone_number,
  //       inviteCategory: refData.type,
  //       showQr: false
  //     },
  //   });
  //   modal.present();
  //   modal.onDidDismiss().then((data) => {
  //     this.clickDisable = '';
  //     this.commonService.closeProgressBarLoading()
  //     // this.number = data.data.number;
  //     if (data.data == '1')
  //       this.reportService.sendSms(refData.phone_number, msgBody);
  //     else if (data.data == '0') {
  //       console.log("whatsapp intent must be called here");
  //       console.log(refData.phone_number);
  //       console.log("inviting via whatsapp");
  //       let url = 'https://wa.me/' + '+91' + refData.phone_number.toString() + '?text=' + msgBody;
  //       const inappBrowser = this.inappBrowser.create(url, '_system', 'location=no');
  //     }
  //   });
  // }
}
