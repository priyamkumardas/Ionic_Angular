import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/config/constants';
import { PhoneCheck } from 'src/app/config/constants';
import { AuthService } from 'src/app/lib/services/auth.service';
import { CommonService } from 'src/app/lib/services/common.service';
import { StorageService } from 'src/app/lib/services/storage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  phoneNumber: any = null;
  invalidPhone: boolean = true;
  enableSendOtp: boolean = false;
  returnURL: any;
  helpVideo: any;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private authService: AuthService,
    private storageservice: StorageService,
  ) { }

  ngOnInit() {
    // if (localStorage.getItem(Constants.AUTH_TOKEN)) {
    //   const data = this.storage
    // }
  }

  sendNumberForOtp(inputinfo) {
    if (!inputinfo.value) return;
    const params = { phone: inputinfo.value };
    if (!this.invalidPhone) {
      this.commonService.presentLoading();
      this.authService.sendOtp(params).toPromise().then((res: any) => {
        if (res.success) {
          if (res.data?.isNewUser) {
            console.log(res.data.isNewUser, 'isNewUser')
            /**if we get isNewUser true in verifyOtp api's response then this popup will come*/
            this.commonService.customAlert('Do you have refferal code?', '', () => {
              this.router.navigate(['qr-scanner'], {
                queryParams: {
                  phone: params.phone,
                  returnUrl: this.returnURL
                }
              })
            }, () => {
              this.router.navigate(['otp', btoa(JSON.stringify(inputinfo.value))])//if he clicks on no button then it'll redirect to otp screen
            });
          } else if (!res.data?.isNewUser) { //if user is not new user then directly redirect to otp screen
            this.router.navigate(['otp', btoa(JSON.stringify(inputinfo.value))]);
          }
        } else if (res && res.error) { //error handling
          this.commonService.toast(res.error.message);
        }
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        this.commonService.dissmiss_loading()
      });
    }
  }

  validatePhone(e) {
    this.invalidPhone = !PhoneCheck(this.phoneNumber);
  }

  agree(e) {
    this.enableSendOtp = e.currentTarget.checked;
  }

  isNumberKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      evt.preventDefault();
    } else {
      return true;
    }
  }

  openUrl(url: string) {
    window.open(url, '_system', 'location=yes')
  }

  async openHelpVideo() {
    this.helpVideo = this.storageservice.getItem(Constants.HELP_VIDEOS);
    this.commonService.openHelpVideo(this.helpVideo.Onboarding)
   }
}
