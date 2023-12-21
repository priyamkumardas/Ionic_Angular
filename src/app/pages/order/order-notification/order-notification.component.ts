import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/lib/services/common.service';
import { OrderService } from 'src/app/lib/services/order.service';
import { CancelOrderModalComponent } from '../cancel-order-modal/cancel-order-modal.component';

@Component({
  selector: 'app-order-notification',
  templateUrl: './order-notification.component.html',
  styleUrls: ['./order-notification.component.scss'],
})
export class OrderNotificationComponent implements OnInit {

  @Input() order

  constructor(
    private modalCtrl: ModalController,
    private orderService: OrderService,
    private commonService: CommonService,
    private router: Router) {
  }

  ngOnInit() {
    this.order = JSON.parse(this.order)
    console.log(this.order)
  }

  getCharector(str: any) {
    return str.charAt(0) + str.charAt(str.indexOf(' ') + 1)
  }

  dismissModal() {
    this.modalCtrl?.dismiss()
  }

  async cancel(orderItem: any, statusText: string) {
    const modal = await this.modalCtrl.create({
      component: CancelOrderModalComponent,
      cssClass: 'cancel-order-modal',
      componentProps: {
        'orderType': statusText
      }
    });
    modal.onDidDismiss().then((modelData: any) => {
      if (modelData !== null && modelData !== undefined && modelData !== "") {
        if (modelData.data.status == 'Yes') {
          this.orderStatusChangeView(orderItem, statusText);
        }
        console.log('Modal Data : ' + modelData);
      }
    });
    await modal.present();
  }

  async acceptOrder(orderItem: any, statusText: string) {
    const modal = await this.modalCtrl.create({
      component: CancelOrderModalComponent,
      cssClass: 'cancel-order-modal',
      componentProps: {
        'orderType': statusText,
        isOrder: false
      }
    });
    modal.onDidDismiss().then((modelData: any) => {
      if (modelData !== null && modelData !== undefined && modelData !== "" && modelData.data != undefined) {
        if (modelData.data.status == 'Yes') {
          this.orderStatusChangeView(orderItem, statusText);
        }
        console.log(modelData);
      }
    });
    await modal.present();
  }

  orderStatusChangeView(orderItem: any, statusText: string) {
    this.commonService.presentLoader().then(presentLoading => {
      presentLoading.present()
      if (orderItem.orderID != null && orderItem.orderID != undefined && orderItem.orderID != "") {
        let statusOrder = {
          "status": statusText
        }
        this.orderService.updateOrderStatus(orderItem.orderID, statusOrder).subscribe((order: any) => {
          if (order.success) {
            orderItem.status = statusText;
            presentLoading.dismiss();
            statusText == 'ACCEPTED' ? this.commonService.success('Order accepted successfully.') : this.commonService.toast('Order rejected.')
          } else {
            presentLoading.dismiss();
          }
          this.modalCtrl?.dismiss()
        }, (error) => {
          this.modalCtrl?.dismiss()
          console.log(error)
          presentLoading.dismiss();
        });
      } else {
        presentLoading.dismiss();
      }
    })
  }

  gotoOrderDetails(order) {
    this.router.navigate(['/order-details', order.orderID, order.status]);
  }
}