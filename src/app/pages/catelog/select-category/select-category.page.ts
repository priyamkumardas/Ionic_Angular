
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, AlertController, ModalController } from '@ionic/angular';
import { ProductsService } from 'src/app/lib/services/products.service';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Constants } from 'src/app/config/constants';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { CommonService } from 'src/app/lib/services/common.service';

import { CancelOrderModalComponent } from '../../order/cancel-order-modal/cancel-order-modal.component';

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.page.html',
  styleUrls: ['./select-category.page.scss'],
})
export class SelectCategoryPage implements OnInit {

  masterCategoryArray: any;
  categories = [];
  selectedCategories = []; //Array consists of all the categories selected by users
  categoryPresentinBackend = []
  // allCategories = [];
  // selectedCategoriesTemp = [];
  // selectedCategorieIds = [];
  // searchCategories;
  // selectedProducts = [];
  // getProductDataFromBackend = [];

  public categorySubject = new BehaviorSubject<string>('false');
  isLoading: boolean;
  searchLang: any;
  helpVideo: any;


  constructor(
    private navCtrl: NavController,
    private productsService: ProductsService,
    private storageService: StorageService,
    private router: Router,
    public commonService: CommonService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getCatalogDataFromBackend();
    // this.storageService.getItemNativeCatalog(Constants.SELECTED_CATEGORIES).then(selectedCategories => {
    //   console.log('selectedCategories', JSON.parse(selectedCategories));
    //   this.selectedCategories = JSON.parse(selectedCategories) ? JSON.parse(selectedCategories) : [];
    // })
    this.getSpashScreenData();
  }

  async pullToRefresh(event) {
    this.commonService.alert('Are you Sure?', 'Do you want to Refresh.', 'No', 'Yes', () => event.target.complete()
      , () => setTimeout(() => {
        this.getCatalogDataFromBackend();
        event.target.complete();
      }))
  }

  getCatalogDataFromBackend() {
    this.selectedCategories = []
    this.categoryPresentinBackend = []
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.productsService.getCatalogList().subscribe((resp: any) => {
        loading.dismiss()
        if (resp.success) {
          console.log(resp)
          let savedCatalog = []
          resp.data.catalog.map(catalog => {
            savedCatalog.push(catalog.id)
            this.categoryPresentinBackend.push(catalog.name)
          })
          console.log(this.masterCategoryArray);
          this.masterCategoryArray.map(master => {
            if (savedCatalog.includes(master.id)) {
              this.selectedCategories.push(master)
              master.checked = true
            }
          })
          console.log(this.selectedCategories, 'selected cat')
        }
      }, error => {
        loading.dismiss()
        console.log(error);
      })
    });
  }

  /**
   * @name getSpashScreenData
   * @type Function - Get all allCategories, microcategories, and products
   * **/
  getSpashScreenData() {
    this.storageService.getItemNativeCatalog(Constants.PRODUCT_DATA).then(catelogPresentinStorage => {
      if (catelogPresentinStorage) {
        var jsonObj = JSON.parse(catelogPresentinStorage);
        console.log(jsonObj);
        this.masterCategoryArray = jsonObj.masterCatalogData.catalog
        if (jsonObj) {
          /**
           * Partner Catalog Data
           */
          // this.getCatalogDataFromBackend();
        } else {
          this.productsService.getcatogoriesList().subscribe((res: any) => {
            if (res && res.data && res.data.catalogue_meta) {
              /**
               * Changed master catalog data array new URL
               */
              const urls = {
                masterCatalogData: res.data.catalogue_meta['masterCatalog'][0].url
              }
              this.productsService.homegetProductsListNew(urls).subscribe((data: any) => {
                if (data) {
                  console.log(data)
                  this.masterCategoryArray = data.masterCatalogData.catalog
                  this.storageService.setItemNativeCatalog(Constants.PRODUCT_DATA, data);
                }
              });
            }
          });
        }
      }
    });
  }


  /**
   * @name chooseCategory
   * @type Function - Select/Unselect the allCategories
   * @param evt - Event triggred on click
   * @param id - Category Id
   * **/

  chooseCategory(category): void {
    if (this.categoryPresentinBackend.includes(category.name)) {
      this.commonService.danger('Cannot unselect this category')
    } else {
      if (this.selectedCategories.filter(res => res.id == category.id).length) {
        let categoryExistsIndexID = this.selectedCategories.filter(res => res.id != category.id)
        this.selectedCategories = categoryExistsIndexID
      } else {
        this.selectedCategories.push(category)
      }
      console.log('selectedCategories', this.selectedCategories)
    }
  }

  searchFunction() {
    this.categories = this.masterCategoryArray.filter((category) =>
      category.name.toLowerCase().includes(this.searchLang.toLowerCase())
    );
  }

  navigate() {
    console.log(this.selectedCategories, 'selectedCategories')
    this.storageService.setItemNativeCatalog(Constants.SELECTED_CATEGORIES, this.selectedCategories);
    this.router.navigate(['/select-food'])
  }

  // async confirmCategoryUncheck(categoryItem: any, statusText: string) {
  //   const modal = await this.modalCtrl.create({
  //     component: CancelOrderModalComponent,
  //     cssClass: 'cancel-modal-component-css',
  //     componentProps: {
  //       'orderType': statusText
  //     }
  //   });
  //   modal.onDidDismiss().then((modelData: any) => {
  //     console.log('here');
  //     console.log(modelData);
  //     if (modelData !== null && modelData !== undefined && modelData !== "") {
  //       if(modelData.data.status == 'Yes'){


  //         console.log(categoryItem);
  //         const cIndex = this.selectedCategories.findIndex((v) => +v.id === +categoryItem.id);
  //         const pIndex = this.selectedCategorieIds.findIndex((v) => +v === +categoryItem.id);
  //         if (pIndex > -1) {
  //           this.selectedCategories.splice(cIndex, 1);
  //           this.selectedCategorieIds.splice(pIndex, 1);
  //         } else {
  //           if(categoryItem.checked == false){
  //             this.selectedCategories.push(categoryItem);
  //             this.selectedCategorieIds.push(categoryItem.id.toString());
  //           } else {
  //             this.selectedCategories.splice(cIndex, 1);
  //             this.selectedCategorieIds.splice(pIndex, 1);
  //           }
  //         }

  //         console.log(this.selectedCategories);

  //         this.storageService.setItemNativeCatalog(Constants.SELECTED_CATEGORIES, this.selectedCategories);


  //       }
  //       console.log('Modal Data : ' + modelData);
  //     }
  //   });
  //   await modal.present();
  // }

  async openHelpVideo() {
    this.helpVideo = this.storageService.getItem(Constants.HELP_VIDEOS);
    this.commonService.openHelpVideo(this.helpVideo.Catalog)
  }
}
