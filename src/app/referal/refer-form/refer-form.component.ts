import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { CommonService } from 'src/app/lib/services/common.service';
import { ReferralService } from '../referral.service';
import { Constants, PhoneCheck } from 'src/app/config/constants';
import { InviteModalComponent } from '../invite-modal/invite-modal.component';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { StorageService } from 'src/app/lib/services/storage.service';


import { Router } from '@angular/router';

@Component({
  selector: 'app-refer-form',
  templateUrl: './refer-form.component.html',
  styleUrls: ['./refer-form.component.scss'],
})
export class ReferFormComponent implements OnInit {
  msgBody: string
  inviteVia: any
  phoneNumber: any = null;
  invalidPhone: boolean = true;
  mobileNumber: any;
  userId: any = 1;
  showBottomSheet: boolean = false;
  inviteType: any;
  helpVideo: any;
  clickDisable
  
  constructor(
    private modalCtrl: ModalController,
    public referralService: ReferralService,
    public actionSheetController: ActionSheetController,
    public commonService: CommonService,
    public alertController: AlertController,
    private inappBrowser: InAppBrowser,
    private storageService: StorageService,

    // private sms: SMS
    private router: Router
  ) { }

  ngOnInit() {
    this.referralService.inviteType.subscribe((res: any) => {
      this.inviteType = res;

    });
  }

  invite() {
    if (this.mobileNumber && this.mobileNumber.length === 10) {
      this.commonService.presentProgressBarLoading()
      this.referralService.sendReferralInvite(this.mobileNumber.toString(), this.inviteType.value).subscribe((res: any) => {
        if (res['success']) {
          this.inviteModal()
          this.commonService.closeProgressBarLoading()
        } else {
          this.commonService.danger(res.error.message);
          this.commonService.closeProgressBarLoading()
        }
      }, err => {
        this.commonService.danger(err.error.error.message);
        this.commonService.closeProgressBarLoading()
      });
    } else {
      this.referralService.showToastNumber();
    }
  }

  async inviteModal() {
    this.modalCtrl.dismiss()
    console.log(this.inviteType.value, 'this.inviteType.value')
    const modal = await this.modalCtrl.create({
      component: InviteModalComponent,
      componentProps: {
        inviteCategory: this.inviteType.value,
        mobileNumber: this.mobileNumber,
        isModal: true,
      },
    });
    modal.present();
    modal.onDidDismiss().then((data) => {
      console.log(data)
    });
  }

  isNumberKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      evt.preventDefault();
    } else {
      return true;
    }
  }

  validatePhone(e) {
    this.invalidPhone = !PhoneCheck(this.mobileNumber);
    this.isNumberKey(e)
  }

  hideBottomSheet() {
    this.mobileNumber = null;
    this.showBottomSheet = false;
    this.action('confirm');
  }

  action(arg) {
    return this.modalCtrl.dismiss(arg);
  }

  refferalclose() {
    this.referralService.closeReferralModal();
  }

  openMyRewardsModal() {
    this.modalCtrl.dismiss();
    this.router.navigate(['/referal/my-referal']);
  }

  async openHelpVideo() {
    this.clickDisable = 'disableClick';
    this.helpVideo = this.storageService.getItem(Constants.HELP_VIDEOS);
    this.commonService.openHelpVideo(this.helpVideo?.Referral);
    this.clickDisable = '';
  }
}
