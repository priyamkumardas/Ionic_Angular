import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Constants } from 'src/app/config/constants';
import { Router } from '@angular/router';
import { LoadingController, ModalController, NavController } from '@ionic/angular';
import { ProductsService } from 'src/app/lib/services/products.service';
import { CommonService } from './../../../lib/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
//import { BrowseCatalogPage } from '../select-food/browse-catalog/browse-catalog.page';

import { SelectCategoryPage } from "src/app/pages/catelog/select-category/select-category.page";

@Component({
  selector: 'app-select-food',
  templateUrl: './select-food.page.html',
  styleUrls: ['./select-food.page.scss'],
})
export class SelectFoodPage implements OnInit {

  productListing = [];
  finalData = [];
  selectedCategory; //its been used to highlight selected Category
  selectedSubCategory: any; //its been used to highlight selected subCategory
  selectedIds = [];
  finalCatelog = [];
  savedProduct: { [k: string]: any } = {};
  helpVideo: any;
  searchedProducts: any;
  searchProduct = '';
  searchProducts = [];
  totalCount = 0;
  searchSelected: any;
  constructor(
    private router: Router,
    public productsService: ProductsService,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private storageService: StorageService,
    public commonService: CommonService,
    public alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private SelectCategoryPage: SelectCategoryPage
  ) { }

  ngOnInit() { }
  ionViewWillEnter() {
    this.finalCatelog = []
    this.savedProduct = []
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.storageService.getItemNativeCatalog(Constants.SELECTED_CATEGORIES).then(res => {
        loading.dismiss()
        // this.productsService.selectedCategories = JSON.parse(res) ? JSON.parse(res) : []
        this.finalData = JSON.parse(res) ? JSON.parse(res) : []
        this.selectedCategory = 0;
        this.selectedSubCategory = 0;
        this.finalData.map(res => {
          this.addCheckBox(res, false, false, true);
        })
        console.log(JSON.parse(res), this.finalData[this.selectedCategory].categories)
        this.getCatalogDataFromBackend();
      })
    });
  }

  getMasterCatalogData() {
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.productsService.getcatogoriesList().subscribe((res: any) => {
        loading.dismiss()
        if (res && res.data && res.data.catalogue_meta) {
          //setting up master catalog url in urls variable which we have received from the splash api
          const urls = {
            masterCatalogData: res.data.catalogue_meta['masterCatalog'][0].url
          }

          //getting catalog version stored in native storage
          this.storageService.getItemNativeCatalog(Constants.CATALOG_VERSION).then(catalogVersion => {
            let currentMasterCatalogVersion = catalogVersion //current master catalog version
            let backendMasterCatalogVersion = res.data.catalogue_meta['masterCatalog'][0].version //master catalog version coming from backend
            console.log(currentMasterCatalogVersion, parseFloat(backendMasterCatalogVersion))

            //checking if current master catalog version is lesser than current version....
            if (parseFloat(currentMasterCatalogVersion) > parseFloat(backendMasterCatalogVersion) || currentMasterCatalogVersion == undefined || currentMasterCatalogVersion == null) {

              //removing master catalog from the native storage
              this.storageService.removeItemNativeCatalog(Constants.PRODUCT_DATA)

              //removing master catalog version from the native storage
              this.storageService.removeItemNativeCatalog(Constants.CATALOG_VERSION)

              //fetching data from the JSON we received from the splash api
              this.productsService.homegetProductsListNew(urls).subscribe((data: any) => {
                //if we get data from JSON then this will run...
                if (data) {
                  //setting new master catalog in native storage
                  this.storageService.setItemNativeCatalog(Constants.PRODUCT_DATA, data);

                  //setting new master catalog version in native storage
                  this.storageService.setItemNativeCatalog(Constants.CATALOG_VERSION, backendMasterCatalogVersion);

                  //logic for updating selected categories....
                  // this.storageService.getItemNativeCatalog(Constants.SELECTED_CATEGORIES).then(res => {
                  //   let selectedCategories = JSON.parse(res)
                  //   let selectedCategorieIds = []
                  //   selectedCategories.map(selectedCat => {
                  //     console.log(selectedCat.id, 'selectedCat.id')
                  //     selectedCategorieIds?.push(selectedCat.id)
                  //     console.log(selectedCategorieIds, 'selectedCategorieIds')
                  //   })
                  //   let updatedSelectedCategories = []
                  //   this.storageService.getItemNativeCatalog(Constants.PRODUCT_DATA).then(masterCatalog => {
                  //     let masterCat = JSON.parse(masterCatalog)
                  //     updatedSelectedCategories = masterCat['masterCatalogData'].catalog
                  //     console.log(updatedSelectedCategories, 'updatedSelectedCategories')
                  //     updatedSelectedCategories.map(category => {
                  //       console.log(category.id, 'category.id')
                  //     })
                  //     this.finalData.map(previousCategory => {
                  //       console.log(previousCategory.id, 'previousCategory.id')
                  //     })
                  //     // removing previous selected data (categories)
                  //     // this.storageService.removeItemNativeCatalog(Constants.SELECTED_CATEGORIES)
                  //     // console.log(this.finalData)
                  //   })
                  //   // removing previous selected data (categories)
                  //   // this.storageService.removeItemNativeCatalog(Constants.SELECTED_CATEGORIES)

                  //   //setting updated categories
                  //   // this.finalData = updatedSelectedCategories.includes
                  //   // updatedSelectedCategories.map(category =>{
                  //   //   console.log(category)
                  //   // })

                  //   // this.storageService.setItemNativeCatalog('updated categories', 'abc');
                  // })
                }
              }, error => {
                console.log(error)
                loading.dismiss()
              });
            } else {
              this.getCatalogDataFromBackend();
            }
          })
        }
      }, error => {
        console.log(error)
        loading.dismiss()
      });
    })
  }

  addCheckBox(catalog, value = false, toCheck = false, isFirst = false) {
    let check = false;
    if (catalog.categories?.length) {
      catalog.categories.map(res => {
        /**
         * @function Recursion fuction is to counter n level of categories
         */
        this.addCheckBox(res, value, toCheck, isFirst)
      })
      /**
       * After checking all the scenarios of categories and if no more categories are found then it'll move to else part
       */
    } else {
      for (let i = 0; i < catalog.products.length; i++) {
        if (toCheck && catalog.products[i]?.checked) {
          check = true;
        } else {
          if (catalog.products[i].status == 'published') {
            catalog.products[i].checked = true;
            /** 
            * !below console is to check selected categories product id's and status (don't remove it we may need during master catlog change)
            */
            // console.log(catalog.products[i].id , catalog.products[i].status , 'if');
          } else {
            catalog.products[i].checked = value;
            /** 
            * !below console is to check selected categories product id's and status (don't remove it we may need during master catlog change)
            */
            // console.log(catalog.products[i].id, catalog.products[i].status , 'else');
          }
          if (isFirst) {
            catalog.products[i].status = 'pending';
          }
        }
        if (toCheck && i == catalog.products.length - 1) {
          catalog.itemSelected = check;
        }
      }
    }
  }

  /**
   * to check count of the selected products
   */
  checkCount(catalog) {
    let check = false;
    if (catalog.categories?.length) {
      catalog.categories.map(res => {
        this.checkCount(res)
      })
    } else {
      for (let i = 0; i < catalog.products.length; i++) {
        /**
         * below if condition is for item count(it counts those products which are available in all in categories not in microcategories)
         * Because it can happen same product is there in all and in it's own microcategory then our count will be double it will count same products 2 times
         */
        if (catalog.products[i]?.checked && catalog.name == 'all') {
          // console.log(catalog)
          this.totalCount += 1;
        }
      }
    }
  }

  addRemoveAll(value): void {
    console.log(this.finalData)
    this.finalData[this.selectedCategory].categories[this.selectedSubCategory].categories[0].itemSelected = value;
    this.addCheckBox(this.finalData[this.selectedCategory].categories[this.selectedSubCategory].categories[0], value);
    this.totalCount = 0;
    this.finalData.map(res => {
      this.checkCount(res);
    })
  }
  addRemoveSearch(condition, query) {
    if (query.toLowerCase().trim() == '') {
      return;
    }
    for (let k = 0; k < this.finalData[this.selectedCategory].categories[this.selectedSubCategory].categories[0].products.length; k++) {
      if (this.finalData[this.selectedCategory].categories[this.selectedSubCategory].categories[0].products[k]?.name?.toLowerCase().includes(query.toLowerCase())) {
        if (this.finalData[this.selectedCategory].categories[this.selectedSubCategory].categories[0].products[k].status == 'published') {
          this.finalData[this.selectedCategory].categories[this.selectedSubCategory].categories[0].products[k].checked = true;
        } else {
          this.finalData[this.selectedCategory].categories[this.selectedSubCategory].categories[0].products[k].checked = condition;
        }

      }
    }
    this.totalCount = 0;
    this.finalData.map(res => {
      this.checkCount(res);
    })
    this.searchSelected = condition;
  }

  checkIsChecked() {
    setTimeout(() => {
      this.addCheckBox(this.finalData[this.selectedCategory]?.categories[this.selectedSubCategory].categories[0], false, true)
      this.totalCount = 0;
      this.finalData.map(res => {
        this.checkCount(res);
      })
    }, 200)
    console.log(this.finalCatelog, ' this.finalCatelog')
  }

  onContinue() {
    const data = this.finalData;
    let d = data;
    this.finalCatelog = [];
    d.map(res => {
      this.getProductId(res)
    });
    d.map(res => {
      this.getProductId(res, true)
    });
    d.map(res => {
      this.addSelectedProducts(res)
    });
    for (let i in Array(20).fill(1)) {
      d.map((res, i) => {
        this.removeCategories(d, res, i)
      })
    }
    // this.storageService.setItemNativeCatalog(Constants.SELECTED_PRODUCT, d);
    // this.storageService.setItemNativeCatalog('selected_product_id', this.finalCatelog)
    console.log(d, this.finalData, this.finalCatelog);
    d.map(res => {
      let allProductsToShow = [];
      res.categories.map(micro => {
        console.log(micro, 'micro')
        micro.categories[0].products.map(product => {
          if (!allProductsToShow.length) {
            console.log(allProductsToShow.length, 'allProductsToShow.length');
            allProductsToShow.push(product)
            console.log(allProductsToShow, 'allProductsToShow-if')
          } else {
            let includes = false
            allProductsToShow.map(res => {
              if (res.id == product.id) {
                includes = true
              }
            })
            if (!includes) {
              allProductsToShow.push(product)
              console.log(allProductsToShow, 'allProductsToShow-else')
            }
          }
        })
      })
      res.categories.splice(0, 0, { name: 'all', products: allProductsToShow });
    })
    this.commonService.presentLoader().then(res => {
      res.present()
      this.productsService.updateCatalogData({ catalog: data }).subscribe((resp) => {
        res.dismiss()
        this.router.navigate(['/my-catalog']);
      }, error => {
        res.dismiss()
        console.log(error);
        this.router.navigate(['/home']);
      });
    })
  }

  getProductId(catalog, setAll = false) {
    if (catalog.categories?.length) {
      catalog.categories.map(res => {
        this.getProductId(res, setAll)
      })
    } else {
      for (let i = 0; i < catalog.products.length; i++) {
        if (catalog.products[i]?.checked && !setAll) {
          this.finalCatelog.push(catalog.products[i].id);
        }
        if (this.finalCatelog.includes(catalog.products[i].id) && setAll) {
          catalog.products[i].checked = true;
        }
      }
    }
  }

  addSelectedProducts(catalog, toUpdate?) {
    if (catalog.categories?.length) {
      catalog.categories.map(res => {
        this.addSelectedProducts(res, toUpdate)
      })
    } else {
      for (let i = 0; i < catalog.products.length; i++) {
        if (toUpdate) {
          /**
           * Below if condition pushes all the products to api from product's microcategory and 'all' product -
           * - list to same status as received from backend
           */
          if (this.finalCatelog.includes(catalog.products[i].id)) {
            catalog.products[i] = this.savedProduct[catalog.products[i].id];
          }
        } else {
          if (!catalog.products[i].checked) {
            catalog.products.splice(i, 1)
            i = i - 1;
          }
        }
      }
    }
  }

  removeCategories(main, catalog, index) {
    if (catalog.categories?.length) {
      catalog.categories?.map((res, i) => {
        this.removeCategories(catalog.categories, res, i)
      })
      if (!catalog.categories.length) {
        main.splice(index, 1)
      }
    } else {
      if (!catalog.products.length) {
        main.splice(index, 1)
      }
    }
  }

  getCatalogDataFromBackend() {
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.productsService.getCatalogList().subscribe((resp: any) => {
        loading.dismiss()
        if (resp.success) {
          console.log(resp)
          resp.data.catalog.map(res => {
            this.addSavedProducts(res);
          });
          console.log(this.finalCatelog, this.savedProduct)
          this.finalData.map(res => {
            this.addSelectedProducts(res, true);
          })
          /**
           * ! selected products count comes from here 
           * @function checkCount
          */
          this.totalCount = 0
          this.finalData.map(res => {
            this.checkCount(res);
          })
          console.log(this.finalData)
        }
      }, error => {
        console.log(error);
        loading.dismiss()
      });
    })
  }

  addSavedProducts(catalog) {
    if (catalog.categories?.length) {
      catalog.categories.map(res => {
        this.addSavedProducts(res)
      })
    } else {
      for (let i = 0; i < catalog.products.length; i++) {
        // console.log(catalog);
        if (!this.finalCatelog.includes(catalog.products[i].id)) {
          this.finalCatelog.push(catalog.products[i].id);
          if (catalog.name == 'all') {
            catalog.products[i].checked = true;
          }
          this.savedProduct[catalog.products[i].id] = catalog.products[i];
        }
      }
    }
  }

  /**
   * Search products with sub categories (Global Search)
   * !For now it is handled in the template itself... Please do not remove this function we might need it.
   * */
  // searchProductItem(searchbar) {
  //   this.searchProducts = [];
  //   var query = searchbar.target.value;
  //   if (query.toLowerCase().trim() == '') {
  //     return;
  //   }
  //   console.log(query)
  //   for(let i = 0; i < this.finalData.length; i++){
  //     for(let j = 0; j < this.finalData[i].categories.length; j++){
  //       for(let k = 0; k < this.finalData[i].categories[j].categories[0].products.length; k++){
  //         if(this.finalData[i].categories[j].categories[0].products[k].name.toLowerCase().includes(query.toLowerCase())){
  //           this.searchProducts.push(this.finalData[i].categories[j].categories[0].products[k]);
  //         }
  //         let result = this.finalData[i].categories[j].categories[0].products[k].name.toLowerCase().includes(query.toLowerCase())
  //         this.searchProducts = result
  //         console.log(this.searchProducts)
  //       }
  //     }
  //   }
  // }

  async openHelpVideo() {
    this.helpVideo = this.storageService.getItem(Constants.HELP_VIDEOS);
    this.commonService.openHelpVideo(this.helpVideo.Catalog)
  }
}