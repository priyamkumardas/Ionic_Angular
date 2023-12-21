import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-product-detail-model',
  templateUrl: './add-product-detail-model.component.html',
  styleUrls: ['./add-product-detail-model.component.scss'],
})
export class AddProductDetailModelComponent implements OnInit {

  constructor(private modalCtrl : ModalController) { }

  ngOnInit() { }

  async selectItem(item){
    await this.modalCtrl.dismiss(item);
  }

  async cancel() {
    await this.modalCtrl.dismiss();
  }
}