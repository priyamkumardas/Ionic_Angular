import { AddProductDetailModelComponent } from 'src/app/components/add-product-detail-model/add-product-detail-model.component';
// import { ModelComponent } from '@components/model/model.component';
import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/lib/services/common.service';
import { OnboardService } from 'src/app/lib/services/onboard.service';

interface ProductValue {
  id: number;
  name: string;
  image: string;
  soldBy: string;
  quantity: any;
  regularPrice: any;
  discountPrice: any;
  placeOrigin: any;
  description: any;
  selected: boolean;
}

@Component({
  selector: 'app-add-product-details',
  templateUrl: './add-product-details.page.html',
  styleUrls: ['./add-product-details.page.scss'],
})
export class AddProductDetailsPage implements OnInit {

  storedProducts = [];
  itemFilling: any;
  isEnableSave: any;

  constructor(private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private commonService: CommonService,
    private onboardService: OnboardService,
    private storageService: StorageService) { }

  ngOnInit() {
    //this.storedProducts = this.storageService.getItem('selected_product');

    this.storageService.getItemNativeCatalog('selected_product').then(result => {
 
      var jsonObj = JSON.parse(result);

      if (jsonObj != null) {
        //console.log('Selected products: '+ jsonObj);
        this.storedProducts = jsonObj;
      }
      }).catch(e => {
        console.log('error: '+ e);
        this.storedProducts = [];
      // Handle errors here
      });

    const productValue: ProductValue = {
      id: this.storedProducts[0]?.id,
      name: this.storedProducts[0]?.name,
      image: this.storedProducts[0]?.image,
      soldBy: '',
      quantity: '',
      regularPrice: '',
      discountPrice: '',
      placeOrigin: '',
      description: '',
      selected: true,
    };

    this.storedProducts[0] = productValue;
    this.itemFilling = this.storedProducts[0];
  }

  itemSelect(cate) {
    this.storedProducts.forEach((items, ind) => {
      if (items.name === cate.name) {
        const productValue: ProductValue = {
          id: cate?.id,
          name: cate?.name,
          image: cate?.image,
          soldBy: cate?.soldBy,
          quantity: cate?.quantity,
          regularPrice: cate?.regularPrice,
          discountPrice: cate?.discountPrice,
          placeOrigin: cate?.placeOrigin,
          description: cate?.description,
          selected: true
        };
        this.storedProducts[ind] = productValue;
        this.itemFillSelect(ind);
      }
    });
  }

  itemRemove(cate) {
    this.storedProducts.forEach((items, ind) => {
      if (items.name === cate.name) {
        this.storedProducts.splice(ind, 1);
      }
    });
  }

  itemFillSelect(ind) {
    this.itemFilling = this.storedProducts[ind];
  }

  submitForm() {
    console.log(this.itemFilling);
    console.log(this.storedProducts);

    if(this.itemFilling.soldBy == "" || this.itemFilling.soldBy == null || this.itemFilling.soldBy == undefined){
      this.commonService.toast("please select unit of this " + this.itemFilling.name + " item");
    } else if(this.itemFilling.quantity == "" || this.itemFilling.quantity == null || this.itemFilling.quantity == undefined){
      this.commonService.toast("please input the quantity of this " + this.itemFilling.name + " item");
    } else if(this.itemFilling.regularPrice == "" || this.itemFilling.regularPrice == null || this.itemFilling.regularPrice == undefined){
      this.commonService.toast("please input the regular price of this " + this.itemFilling.name + " item");
    } else if(this.itemFilling.discountPrice == "" || this.itemFilling.discountPrice == null || this.itemFilling.discountPrice == undefined){
      this.commonService.toast("please input the discount price of this " + this.itemFilling.name + " item");
    }

    const isEnable = this.storedProducts.every((item) => {
      if(item.soldBy == "" || item.soldBy == null || item.soldBy == undefined){
        return false;
      } else if(item.quantity == "" || item.quantity == null || item.quantity == undefined){
        return false;
      } else if(item.regularPrice == "" || item.regularPrice == null || item.regularPrice == undefined){
        return false;
      } else if(item.discountPrice == "" || item.discountPrice == null || item.discountPrice == undefined){
        return false;
      }
      return true;
    });


    if(isEnable){
      this.isEnableSave = false;
    } else {
      this.isEnableSave = true;
    }
    console.log(isEnable);
  }

  submitProductDetails(){
    const isEnable = this.storedProducts.every((item) => {
      if(item.soldBy == "" || item.soldBy == null || item.soldBy == undefined){
        return false;
      } else if(item.quantity == "" || item.quantity == null || item.quantity == undefined){
        return false;
      } else if(item.regularPrice == "" || item.regularPrice == null || item.regularPrice == undefined){
        return false;
      } else if(item.discountPrice == "" || item.discountPrice == null || item.discountPrice == undefined){
        return false;
      }
      return true;
    });


    if(isEnable){
      console.log(this.storedProducts);
      const catalogData = Object.assign({},{"products":this.storedProducts});
      this.onboardService.addNewCatalogDetails(catalogData, 10).subscribe((res: any) => {
        if(res?.isCatalog.success){
           console.log(res);
        }
      });
    } else {
      this.commonService.toast("Please check some data is missing");
    }
  }

  async unitSelect(item) {
    const model = await this.modalCtrl.create({
      component: AddProductDetailModelComponent,
      cssClass: 'my-model-component-css',
    })
    await model.present();
    return await model.onWillDismiss().then((data) => {
      if (data && data.data) {
        //this.selectUnit = data.data;
        item.soldBy = data.data.toUpperCase();
        
        this.storedProducts.map((itm, ind) => {
          if((item.name === itm.name) && (item.id === itm.id)){
            this.itemFilling = this.storedProducts[ind];
            this.storedProducts[ind] = item;
          }
        });
      }
    });
  }

  onBack(){
    this.navCtrl.back();
  }
}

