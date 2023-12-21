import { ActionSheetController, Platform, IonRouterOutlet } from '@ionic/angular';
import { Component } from '@angular/core';
import { Constants } from 'src/app/config/constants';
import { Router } from '@angular/router';
import { CommonService } from '../../lib/services/common.service';
import { ReferralService } from 'src/app/referal/referral.service';
import { PaymentService } from 'src/app/lib/services/payment.service';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Optional } from '@angular/core';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  subscriptionsStatus: any;
  userSubscriptionStatus: boolean = false;
  constructor(
    private router: Router,
    public commonservice: CommonService,
    public refferalservice: ReferralService,
    private commonService: CommonService,
    private paymentService: PaymentService,
    private storageService: StorageService,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    @Optional() private routerOutlet?: IonRouterOutlet

  ) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
  }


  ngOnInit() { }

  checkSubscriptionStatus() {
    this.commonService.presentLoader().then(loading => {
      loading.present()
      let shopId = this.storageService.getItem(Constants.SHOP_ID)
        ? this.storageService.getItem(Constants.SHOP_ID)
        : this.commonService.userData.shopId;

      this.paymentService.checkStatusSubscriptions(shopId).subscribe((subscriptionStatus: any) => {
        console.log(subscriptionStatus)
        loading.dismiss();
        if (subscriptionStatus.success && subscriptionStatus.data.subscription_status == "ACTIVE") {
          this.subscriptionsStatus = true;
        } else {
          this.subscriptionsStatus = false;
        }
        this.storageService.setItem(Constants.ACTIVE_SUBSCRIPTION_FLAG, this.subscriptionsStatus)
        this.router.navigate(['/package-list']);
      }, error => {
        console.log(error);
        loading.dismiss();
      });
    })
  }

  async goToCatalog() {
    const actionSheet = await this.actionSheetCtrl.create({
      mode: 'ios',
      cssClass: 'catalog-popup',
      buttons: [
        {
          text: 'Add Product',
          icon: 'add-outline',
          data: {
            action: '',
          },
          handler: () => {
            this.storageService.getItemNativeCatalog(Constants.SELECTED_CATEGORIES).then(result => {
              if (result) {
                this.router.navigate(['/select-food']);
              } else {
                this.router.navigate(['/select-category']);
              }
            })


          }
        },
        {
          text: 'Update Product',
          icon: 'reload-outline',
          data: {
            action: '',
          },
          handler: () => {
            this.router.navigateByUrl('/my-catalog', { state: { page: "Update" } });
          }
        },
        {
          text: 'Recommended Products',
          icon: 'thumbs-up-outline',
          data: {
            action: '',
          },
          handler: () => {
            this.commonservice.featureNotAvailable();
            this.goToCatalog();
            //this.router.navigate(['/my-catalog']);
          }
        },
        {
          icon: 'close-outline',
          role: 'cancel',
          data: {
            action: 'cancel',
          }
        },
      ],
    });

    await actionSheet.present();
  }

  // Refer Banner
  refferalModule() {
    this.router.navigate(['referal'])
  }

  //Order Management
  orderModuleOpen() {
    this.router.navigate(['/order']);
  }

  gotToQrScanPage(inx) {
    this.router.navigate(['/scan-qr-code', { data: JSON.stringify(inx) }]);
  }

  async goToUserManagement() {
    this.router.navigateByUrl('/user-list');
  };

  crmOpen() {
    this.router.navigate(['/customers']);
  }

  gotoMyQr() {
    this.router.navigate(['/my-qr']);
  }
}
