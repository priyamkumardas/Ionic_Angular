import { CommonService } from './../../../../lib/services/common.service';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { OrderQuantityPage } from '../order-quantity/order-quantity.page';
import { ProductGradingPage } from '../product-grading/product-grading.page';
@Component({
  selector: 'app-product-pricing',
  templateUrl: './product-pricing.page.html',
  styleUrls: ['./product-pricing.page.scss'],
})
export class ProductPricingPage implements OnInit {
  @Input() product = {
    price: 0,
    name: '',
    image: '',
    soldBy: '',
    grading: '',
    discount: 0,
    quantity: 0,
    status: null
  };

  soldByCategories = [{
    image: 'assets/productpricingpageimg/pieces.svg',
    name: 'Pieces',
    key: 'pieces',
    soldBy: 'Pcs'
  },
  {
    image: 'assets/productpricingpageimg/kg.svg',
    name: 'Weight',
    key: 'Weight',
    soldBy: 'Kg',
  },
  {
    image: 'assets/productpricingpageimg/measure-cup.svg',
    name: 'Liter',
    key: 'liter',
    soldBy: 'Ltr',
  },
  {
    image: 'assets/productpricingpageimg/glass.svg',
    name: 'Glass',
    key: 'Glass',
    soldBy: 'Gls',
  },
  {
    image: 'assets/productpricingpageimg/Plat.svg',
    name: 'Plates',
    key: 'Plates',
    soldBy: 'Plt',
  },
  {
    image: 'assets/productpricingpageimg/Packet.svg',
    name: 'Packets',
    key: 'Packets',
    soldBy: 'Pkt',
  },
  ];

  @Input() from: String;
  decimalCount: number;
  val: string;
  constructor(
    private modalCtrl: ModalController,
    public commonService: CommonService
  ) { }

  ngOnInit() {
    // console.log(this.product)
  }

  selectItem(item) {
    this.product.soldBy = item;
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  async saveProduct() {
    //saving price for the product
    if (this.product.price < 0) {
      this.commonService.danger('Price cannot be in negative');
      return;
    }
    if (!this.product.price) {
      this.commonService.danger('Please enter price');
      return;
    }
    if (!this.product.soldBy) {
      this.commonService.danger('Please select sold by');
      return;
    }
    if (this.decimalCount > this.val?.length) {
      this.commonService.danger('The decimal value can not be more than 3 place');
      return;
    }

    //saving discount for the product
    let isValidNumber = isNaN(this.product.discount)
    if (!this.product.discount) {
      this.product.discount = 0;
      this.product?.grading == undefined ? this.product.grading = '1' : this.product.grading;
      this.product.status == 'pending' ? this.product.status = 'unpublished' : '';
      await this.modalCtrl.dismiss(this.product);
    } else if (!isValidNumber) {
      if (this.product.discount >= 100) {
        this.commonService.danger('The discount cannot be greater than 99%');
        return this.product.discount;
      } else if (this.product.discount < 0) {
        this.commonService.danger('The discount cannot be less than 0%');
        return this.product.discount = 0;
      } else {
        this.product?.grading == undefined ? this.product.grading = '1' : this.product.grading;
        this.product.status == 'pending' ? this.product.status = 'unpublished' : '';
        await this.modalCtrl.dismiss(this.product);
      }
    } else {
      this.commonService.danger('Please enter a valid no.')
    }
    await this.modalCtrl.dismiss(this.product);
  }

  checkPrice(event) {
    this.val = parseFloat(event.detail.value)?.toFixed(3)?.toString();
    this.decimalCount = parseFloat(event.detail.value)?.toString()?.length
    if (event.detail.value < 0) {
      this.commonService.danger('Price cannot be in negative');
      return;
    }
    if (parseFloat(event.detail.value)?.toString()?.length > this.val?.length) {
      this.commonService.danger('The decimal value can not be more than 3 place');
      return;
    }
  }

  //changing discount from plus and minus button on ui.
  changeDiscount(type) {
    console.log(this.product.discount);
    if (type === 'inc') {
      if (this.product.discount >= 100) {
        this.commonService.danger('The discount cannot be greater than 99%');
        return;
      } else {
        this.product.discount = +this.product.discount ? +this.product.discount + 1 : 1;
      }
    } else {
      if (this.product.discount <= 0) {
        this.commonService.danger('The discount cannot be less than 0%');
        return;
      } else {
        this.product.discount = +this.product.discount ? +this.product.discount - 1 : 0;
      }
    }
  }

  //to check discount limitations
  checkDiscount(event) {
    if (event.detail.value >= 100) {
      this.commonService.danger('The discount cannot be greater than 99%');
      return;
    }
    if (event.detail.value < 0) {
      this.commonService.danger('The discount cannot be less than 0%');
      return;
    }
  }

  /**
 * @function for adding minimum order quantity to the product...
 */
  async openOrderQuentity(product) {
    const model = await this.modalCtrl.create({
      component: OrderQuantityPage,
      cssClass: 'DeliveryDayPreference-component-css',
      componentProps: {
        product: product,
        from: this.from,
      },
    });
    await model.present();
    const { data } = await model.onWillDismiss();
  }

  /**
* @function for adding grading to the product...
*/
  async openGradingPopUp(product) {
    const model = await this.modalCtrl.create({
      component: ProductGradingPage,
      cssClass: 'DeliveryDayPreference-component-css',
      componentProps: {
        product: product,
        from: this.from,
      },
    });
    await model.present();
    const { data } = await model.onWillDismiss();
  }
}
