import { CommonService } from './../../../../lib/services/common.service';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-browse-catalog',
  templateUrl: './browse-catalog.page.html',
  styleUrls: ['./browse-catalog.page.scss'],
})
export class BrowseCatalogPage implements OnInit {

  @Input() product = {
    price: 0,
    name: '',
    image: '',
    soldBy: '',
    grading: '',
    discount: 0,
  };
  @Input() from:String;
  constructor(
    private modalCtrl: ModalController,
    private commonService: CommonService
  ) {}

  ngOnInit() {}

  selectItem(item) {
    this.product.soldBy = item;
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  async saveProduct() {
    if (!this.product.price) {
      this.commonService.danger('Please enter price');
      return;
    }
    if (!this.product.soldBy) {
      this.commonService.danger('Please select sold by');
      return;
    }
    await this.modalCtrl.dismiss(this.product);
  }

  async skipProduct(){
    await this.modalCtrl.dismiss();
  }

  changePrice(type) {
    if (type === 'inc') {
      this.product.price = +this.product.price ? +this.product.price + 1 : 1;
    } else {
      this.product.price = +this.product.price ? +this.product.price - 1 : 0;
    }
  }

  

}
