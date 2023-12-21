import { Component, OnInit } from '@angular/core';
import { ProductsService } from './lib/services/products.service';
import { StorageService } from './lib/services/storage.service';
import { ReferralService } from "src/app/referal/referral.service";
import { Constants } from 'src/app/config/constants';
import { FirebaseService } from "src/app/lib/services/firebase.service";
import { Platform } from '@ionic/angular';
import { CommonService } from 'src/app/lib/services/common.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private productsService: ProductsService,
    private storageService: StorageService,
    private refferalService: ReferralService,
    private firebaseService: FirebaseService,
    private commonService: CommonService,
    private storage: Storage

  ) { }

  async ngOnInit() {
    this.firebaseService.initPush();
    this.getSpashScreenData();
    this.refferalService.setAppPackage()
    this.refferalService.initFlyy()
    this.refferalService.setThemeColor();
    await this.storage.create();
  }

  /**
   * @name getSpashScreenData
   * @type Function - Get all categories, microcategories, and products. And store into localStorage
   * **/
  getSpashScreenData() {
    this.productsService.getSplashApi().subscribe((res: any) => {
      /**
       * Checking app version for force update
       */
      if (res && res.data && res.data.appVersions) {
        if (environment.app_name == 'householdApp') {
          this.commonService.remoteAppVersionName = res.data.appVersions.household;
          this.commonService.appCheckUpdate();
        } else if (environment.app_name == 'retailerApp') {
          this.commonService.remoteAppVersionName = res.data.appVersions.retailer;
          this.commonService.appCheckUpdate();
        }
      }
      /**
       * Fetching master catalog json url from splash api.
       */
      if (res && res.data && res.data.catalogue_meta) {
        const urls = {
          masterCatalogData: res.data.catalogue_meta['masterCatalog'][0].url
        }
        let masterCatalogVersion = res.data.catalogue_meta['masterCatalog'][0].version
        this.storageService.setItemNativeCatalog(Constants.CATALOG_VERSION, masterCatalogVersion);
        this.productsService.homegetProductsListNew(urls).subscribe((data) => {
          if (data) {
            this.storageService.setItemNativeCatalog(Constants.PRODUCT_DATA, data);
          }
        });
      }
      /**
       * @helpVideos Fetching helpVideos url from splash api response
       */
      if (res && res.data && res.data.helpVideos) {
        this.storageService.setItem(Constants.HELP_VIDEOS, res.data.helpVideos);
      }
    });
  }
}
