import { Component, OnInit, Input } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ReferralService } from '../referral.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Constants } from 'src/app/config/constants';
import { CommonService } from 'src/app/lib/services/common.service';
import { OnboardService } from 'src/app/lib/services/onboard.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.scss'],
})
export class InviteModalComponent implements OnInit {
  @Input() inviteCategory
  @Input() mobileNumber
  queryParams: any;
  @Input() isModal: boolean;
  profileUrl: any;
  msgBody: any;

  constructor(
    private modalCtrl: ModalController,
    public referralService: ReferralService,
    private alertController: AlertController,
    private inappBrowser: InAppBrowser,
    private storageService: StorageService,
    public commonservice: CommonService,
    private router: Router,
    private _location: Location,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    if (!this.isModal) {
      this.queryParams = this.router.getCurrentNavigation().extras.state;
      console.log(this.queryParams)
      console.log(this.queryParams.referals)
    }
  }

  ionViewWillEnter() {
    if (this.isModal) {
      this.inviteType()
    }
    this.getShopOwnerDetailsFromLocal()
  }

  getShopOwnerDetailsFromLocal() {
    this.profileUrl = this.storageService.getItem(Constants.PROFILE_URL);
    console.warn(this.profileUrl, 'profileUrl')
  }

  inviteType() {
    console.log(this.inviteCategory, this.mobileNumber, 'inviteCategory');
    if (this.inviteCategory == 'INDIVIDUAL') {
      this.msgBody = this.referralService.Individual_Message_BODY
    }
    if (this.inviteCategory == 'RETAILER') {
      this.msgBody = this.referralService.Retailer_Message_BODY
    }
    if (this.inviteCategory == 'LOGISTICS_DELIVERY') {
      this.msgBody = this.referralService.Logistic_Message_BODY
    }
    console.log(this.msgBody)
  }

  inviteVia(data) {
    console.log(data)
    if (data == '1') {
      this.inviteType()
      this.showConfirm(false);
    }
    if (data == '0') {
      this.inviteType()
      let url = 'https://wa.me/' + '+91' + this.mobileNumber.toString() + '?text=' + this.msgBody;
      const inappBrowser = this.inappBrowser.create(url, '_system', 'location=no');
      this.openMyRewardsModal();
    }
  }

  sendReminder(via) {
    let msgBody
    if (this.queryParams.referals.type == 'INDIVIDUAL') {
      msgBody = this.referralService.Individual_Message_BODY
    } else if (this.queryParams.referals.type == 'RETAILER') {
      msgBody = this.referralService.Retailer_Message_BODY
    } else if (this.queryParams.referals.type == 'LOGISTICS_DELIVERY') {
      msgBody = this.referralService.Logistic_Message_BODY
    }

    //send sms via sms or whatsapp
    if (via == '1') {
      this.referralService.sendSms(this.queryParams.referals.phone_number, msgBody);
    } else if (via == '0') {
      let url = 'https://wa.me/' + '+91' + this.queryParams.referals.phone_number.toString() + '?text=' + msgBody;
      const inappBrowser = this.inappBrowser.create(url, '_system', 'location=no');
    }
    this._location.back()
  }

  action(arg) {
    return this.modalCtrl.dismiss(arg);
  }

  showConfirm(remainder?) {
    this.alertController.create({
      header: 'Send Referral Invite',
      subHeader: 'Carrier SMS charges may apply',
      message: 'Are you sure? You want to send referral invite to this number?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('I care about humanity');
          },
        },
        {
          text: 'Yes!',
          handler: () => {
            // this.sms.send(this.mobileNumber, 'Hello world!');
            this.referralService.sendSms(this.mobileNumber, this.msgBody)
            console.log(remainder)
            remainder ? this.dismissModal() : this.openMyRewardsModal()
          },
        },
      ],
    }).then((res) => {
      res.present();
    });
  }

  openMyRewardsModal() {
    console.log("invited via any one ")
    if(this.isModal){
      this.modalCtrl.dismiss()
      this.router.navigate(['/referal/my-referal']);
    } else {
      this.router.navigate(['/referal/my-referal']);
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
