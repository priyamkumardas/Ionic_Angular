import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from 'src/app/lib/services/common.service';
import { CancelOrderModalComponent } from '../cancel-order-modal/cancel-order-modal.component';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
export enum OrderStatus {
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  DELIVERY = 'DELIVERY',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
}
@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent implements OnInit {
  @Input('order') orders;
  @Input('selected-tab') selectedTab = OrderStatus.NEW;
  @Input() order:any
  @Input() showButton:any
  orderStatus = OrderStatus;
  constructor(
    public commonService: CommonService,
    private router:Router,
    private modalCtrl:ModalController
  ) { }

  ngOnInit() {}

  gotoOrderDetails(order){
    this.router.navigate(['/order-details', order.orderID, order.status]);
  }

  orderStatusChangeView(orderItem: any, statusText: string){
    if(orderItem.orderID != null && orderItem.orderID != undefined && orderItem.orderID != ""){
      this.router.navigate(['/order-details', orderItem.orderID, orderItem.status]);
    }
  }

  getCharector(str: any){
    return str.charAt(0) + str.charAt(str.indexOf(' ') + 1)
    }

  checkPaymentAcknowledgement(orderItem: any){
    if(orderItem.orderID != null && orderItem.orderID != undefined && orderItem.orderID != ""){
      this.router.navigate(['/order-details', orderItem.orderID, orderItem.status]);
    }
  }

  async openCancelModal(orderItem: any, statusText: string) {
    const modal = await this.modalCtrl.create({
      component: CancelOrderModalComponent,
      cssClass: 'cancel-order-modal',
      componentProps: {
        'orderType': statusText
      }
    });
    modal.onDidDismiss().then((modelData: any) => {
      if (modelData !== null && modelData !== undefined && modelData !== "") {
        if(modelData.data.status == 'Yes'){
          this.orderStatusChangeView(orderItem, statusText);
        }
        console.log('Modal Data : ' + modelData);
      }
    });
    await modal.present();
  }
}
