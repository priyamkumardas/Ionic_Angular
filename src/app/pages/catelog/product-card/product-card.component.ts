import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonService } from 'src/app/lib/services/common.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() allTab:any;
  @Input() product:any
  @Input() search:any
  @Input() productStatus:any
  @Output() favEventChangeDetails = new EventEmitter();
  @Output() favEventOnSelectProduct = new EventEmitter();
  @Output() favEvenOpenGradingPopUp = new EventEmitter();
  @Output() favEventOpenPricePopUp = new EventEmitter();
  @Output() favEventOpenDiscountPopUp = new EventEmitter();
  constructor(
    private commonService: CommonService,
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {}
  

  changeDetails(product){
    // console.log(product, 'changeDetails');
    this.favEventChangeDetails.emit({product:product})
  }

  onSelectProduct(productid, productStatus){
    // console.log(productid, productStatus ,'onSelectProduct' );
    this.favEventOnSelectProduct.emit({productid:productid, productStatus:productStatus})
  }

  openGradingPopUp(product){
    // console.log(product, 'openGradingPopUp');
    this.favEvenOpenGradingPopUp.emit({product:product})
  }

  openPricePopUp(product){
    // console.log(product, 'openPricePopUp' );
    this.favEventOpenPricePopUp.emit({product:product})
  }

  openDiscountPopUp(product){
    // console.log(product, 'openDiscountPopUp' );
    this.favEventOpenDiscountPopUp.emit({product:product})
  }
}
