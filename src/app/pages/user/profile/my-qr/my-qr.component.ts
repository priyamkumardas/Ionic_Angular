import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/lib/services/common.service';
import { OnboardService } from 'src/app/lib/services/onboard.service';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Constants } from 'src/app/config/constants';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-my-qr',
  templateUrl: './my-qr.component.html',
  styleUrls: ['./my-qr.component.scss'],
})
export class MyQrComponent implements OnInit {
  shopId: string;
  shopQR = ''
  shopDetails: any
  base64Url: any
  responseSuccess: any
  shopName: any;
  shopAddress: any;
  constructor(
    public commonservice: CommonService,
    private storageService: StorageService,
    private onboardService: OnboardService,
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getShopOwnerDetails()
  }

  async ionViewWillLeave() {
    this.commonservice.dismissToast()
  }

  getShopOwnerDetails() {
    this.commonservice.presentLoader().then(loading => {
      this.shopId = this.commonservice.getUserData() && this.commonservice.getUserData().shopId
        ? this.commonservice.getUserData().shopId : this.storageService.getItem(Constants.SHOP_ID);
      loading.present()

      /**
       * @function Profile function is being called
       */
      this.onboardService.getShopOwnerDetails(this.shopId ? this.shopId : null).subscribe((shopDetails: any) => {
        loading.dismiss()
        // this.commonservice.closeProgressBarLoading()
        console.log(shopDetails)
        this.responseSuccess = shopDetails.success
        this.shopDetails = shopDetails.data.shop
        this.shopName = shopDetails.data?.shop?.shop_name;
        this.shopQR = shopDetails.data?.shop?.profileUrl;
      }, error => {
        console.log(error)
        // this.commonservice.closeProgressBarLoading()
        loading.dismiss()
      });
    });
  }

  async shareQr() {
    const canvas = document.getElementById('download') as HTMLCanvasElement;
    html2canvas(canvas).then(async canvas => {
      const imageDataURL = canvas.toDataURL('image/jpeg');
      console.log(imageDataURL);
      this.commonservice.shareQr(this.shopQR, this.shopName, imageDataURL)
    });
  }

  downloadQr() {
    const pageElement = document.getElementById('download');
    console.log(pageElement)
    html2canvas(pageElement, { logging: true, useCORS: true }).then(async canvas => {
      const imageDataURL = canvas.toDataURL('image/jpeg');
      console.log(imageDataURL);
      this.commonservice.savePicture(imageDataURL, "photo");
    });
  }
}
