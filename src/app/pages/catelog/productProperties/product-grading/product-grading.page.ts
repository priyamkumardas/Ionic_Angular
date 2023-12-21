import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from './../../../../lib/services/common.service';


@Component({
  selector: 'app-product-grading',
  templateUrl: './product-grading.page.html',
  styleUrls: ['./product-grading.page.scss'],
})
export class ProductGradingPage implements OnInit {
  @Input() product = {
    price: 0,
    name: '',
    image: '',
    soldBy: '',
    grading: '',
    discount: 0,
    quantity: 0,
  };
  @Input() from: String;
  constructor(private modalCtrl: ModalController,
    private commonService: CommonService
  ) { }

  ngOnInit() { }

  selectGrade(item) {
    this.product.grading = item;
    this.saveProduct();
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  async saveProduct() {
    if (!this.product.grading) {
      this.commonService.danger('Please Select Grading');
      return;
    }
    await this.modalCtrl.dismiss(this.product);
  }

  async backToPricingPopup() {
    await this.modalCtrl.dismiss('back');
  }

  async skipGradingPopup() {
    await this.modalCtrl.dismiss(this.product);
  }
}
