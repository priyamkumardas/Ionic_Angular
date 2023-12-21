import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/lib/services/storage.service';
import { OrderService } from 'src/app/lib/services/order.service';
import { CommonService } from 'src/app/lib/services/common.service';
import { CancelOrderModalComponent } from '../cancel-order-modal/cancel-order-modal.component';
import { OrderPage } from '../order/order.page';
import { ScheduleDatePage } from '../orderProperties/schedule-date/schedule-date.page';
import { ScheduleTimePage } from '../orderProperties/schedule-time/schedule-time.page';
import { ScheduleCalendarPage } from '../orderProperties/schedule-calendar/schedule-calendar.page';
import { DispatchModalComponent } from 'src/app/components/dispatch-modal/dispatch-modal.component';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

export enum OrderStatus {
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  DELIVERY = 'DELIVERY',
  DISPATCHED = 'DISPATCHED',
  IN_TRANSIT = 'IN_TRANSIT',
  REACHED_DELIVERY_LOCATION = 'REACHED_DELIVERY_LOCATION',
  PICKEDUP = 'PICKEDUP',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
}

@Component({
  selector: 'app-order-container',
  templateUrl: './order-container.component.html',
  styleUrls: ['./order-container.component.scss'],
})
export class OrderContainerComponent implements OnInit {

  @Input('order') orders;
  @Input('selected-tab') selectedTab = OrderStatus.NEW;
  orderStatus = OrderStatus;
  activeNav = 'All';
  orderItemStatus: any;
  status: any;
  Start: any;
  userInfo: any;
  clickDisable
  @Output() orderStateChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private storageService: StorageService,
    private orderService: OrderService,
    private modalCtrl: ModalController,
    private inAppBrowser: InAppBrowser,
    private platform: Platform,
    private orderPage: OrderPage
  ) {
  }

  ngOnInit() {
  }

  presentAlert(ind, orderItem: any, statusText: string) {
    // this.commonService.alert('Are you Sure?','You want to change status.','Yes','No',()=>this.orderStatusChangeView(ind, orderItem, statusText),()=>{})
    this.commonService.alert('Are you Sure?', 'You want to change status.', 'Yes', 'No', () => this.orderStatusChangeView(orderItem, statusText), () => { })
  }


  orderStatusChangeViewOld(ind, orderItem: any, statusText: string) {

    if (orderItem.orderID != null && orderItem.orderID != undefined && orderItem.orderID != "") {
      let url = '/order-details' + '/' + orderItem.orderID + '/' + orderItem.status
      this.router.navigateByUrl(url, { state: { page: "Okay" } });
      /* let statusOrder = {
        "status": statusText
      }
      this.orderService.updateOrderStatus(orderItem.orderID, statusOrder).subscribe((order: any) => {
        if(order.success){
          orderItem.status = statusText;
          this.orderItemStatus = order;
          this.orders.splice(ind, 1);
          this.router.navigate(['/order-details', orderItem.orderID, orderItem.status]);
        }
      }, (error) => {
        this.commonService.danger(error);
      }); */
    }
  }


  checkPaymentAcknowledgement(ind, orderItem: any) {
    if (orderItem.orderID != null && orderItem.orderID != undefined && orderItem.orderID != "") {
      this.router.navigate(['/order-details', orderItem.orderID, orderItem.status]);
      /* let paymentOrder = {
        "acknowledged": true
      }
      this.orderService.updatePaymentStatus(orderItem.orderID, paymentOrder).subscribe((order: any) => { 
        if(order.success){
          this.orders.splice(ind, 1);
        }
      }, (error) => {
        this.commonService.danger(error);
      }); */
    }
  }

  async openCancelModal(orderItem: any, statusText: string, tabName?) {
    this.clickDisable = 'disableClick';
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
          this.orderStatusChangeView(orderItem, statusText, tabName);
        }
        console.log('Modal Data : ' + modelData);
      }
    });
    await modal.present();
    this.clickDisable = '';
  }


  openWithInAppBrowser(url) {
    let latlon = url.delivery?.location?.lat + ',' + url.delivery?.location?.lon
    if (this.platform.is('ios')) {
      this.inAppBrowser.create('maps://?q=' + latlon, '_system');
    } else {
      let label = encodeURI(url?.userDetails?.name + ' location');
      this.inAppBrowser.create('geo:0,0?q=' + latlon + '(' + label + ')', '_system');
    }
  }

  async changeOrderStatusModal(orderItem: any, statusText: string, tabName?) {
    this.clickDisable = 'disableClick';
    this.status = statusText;
    console.log(statusText);
    const modal = await this.modalCtrl.create({
      component: CancelOrderModalComponent,
      cssClass: 'cancel-order-modal',
      componentProps: {
        'orderType': statusText
      }
    });
    modal.onDidDismiss().then((modelData: any) => {
      this.clickDisable = '';
      if (modelData !== null && modelData !== undefined && modelData !== "" && modelData.data != undefined) {
        if (modelData.data.status == 'Yes') {
          this.orderStatusChangeView(orderItem, statusText, tabName);
        }
        console.log('Modal Data : ' + modelData);
        if (this.status == 'IN_TRANSIT') {
          this.router.navigate(['/order-details', orderItem.orderID, orderItem.status]);
        }
      }
    });
    await modal.present();
    console.log(this.orders);
  }

  async openDispatchModal(orderItem: any, statusText: string, tabName?) {
    this.clickDisable = 'disableClick';
    this.status = statusText;
    const modal = await this.modalCtrl.create({
      component: DispatchModalComponent,
      cssClass: 'DeliveryDayPreference-component-css',
      componentProps: {
        'orderType': statusText,
        orderItem: orderItem,
        isReDispatch: false
      }
    });
    modal.onDidDismiss().then((modelData: any) => {
      this.clickDisable = '';
      if (modelData !== null && modelData !== undefined && modelData !== "" && modelData.data != undefined) {
        this.orderStatusChangeViewDispatch(orderItem, statusText, tabName);
      }
    });
    await modal.present();
  }

  async openReDispatchModal(orderItem: any, statusText: string, tabName?) {
    this.clickDisable = 'disableClick';
    this.status = statusText;
    const modal = await this.modalCtrl.create({
      component: DispatchModalComponent,
      cssClass: 'DeliveryDayPreference-component-css',
      componentProps: {
        'orderType': statusText,
        orderItem: orderItem,
        isReDispatch: true
      }
    });
    modal.onDidDismiss().then((modelData: any) => {
      this.clickDisable = '';
      console.log(modelData, 'modelData')
      if (modelData !== null && modelData !== undefined && modelData !== "" && modelData.data != undefined) {
        this.orderStatusChangeView(orderItem, statusText, tabName);
      }
    });
    await modal.present();
  }

  orderStatusChangeView(orderItem: any, statusText: string, tabName?) {
    this.commonService.presentLoader().then(presentLoading => {
      presentLoading.present()
      if (orderItem.orderID != null && orderItem.orderID != undefined && orderItem.orderID != "") {
        let statusOrder = {
          "status": statusText
        }
        this.orderService.updateOrderStatus(orderItem.orderID, statusOrder).subscribe((order: any) => {
          if (order.success) {
            orderItem.status = statusText;
            this.orderItemStatus = order;
            this.orderPage.isUpdateOrderItem.next(orderItem);
            presentLoading.dismiss();
            if (tabName) {
              this.orderStateChange.emit({ "value": tabName });
            }
          } else {
            presentLoading.dismiss();
          }
        }, (error) => {
          presentLoading.dismiss();
        });
      } else {
        presentLoading.dismiss();
      }
    })
  }

  orderStatusChangeViewDispatch(orderItem: any, statusText: string, tabName) {
    this.commonService.presentLoader().then(presentLoading => {
      presentLoading.present()
      if (orderItem.orderID != null && orderItem.orderID != undefined && orderItem.orderID != "") {
        this.getUserDetails(orderItem, orderItem.orderID, statusText);
        presentLoading.dismiss();
      } else {
        presentLoading.dismiss();
      }
    })
  }


  getUserDetails(orderItem, orderId, statusText) {
    this.commonService.presentLoader().then(presentLoading => {
      presentLoading.present()
      if (orderItem != null && orderItem != undefined && orderId != "") {
        this.orderService.getOrderByIdDetails(orderId).subscribe((order: any) => {
          if (order.success == true && order.data != null && order.data != undefined) {
            this.userInfo = order.data;
            console.log(this.userInfo?.picker);
            let statusOrder = {
              "status": statusText,
              "userDetails": this.userInfo?.picker
            }
            console.log(statusOrder);
            this.orderService.updateOrderStatus(orderItem.orderID, statusOrder).subscribe((order: any) => {
              if (order.success) {
                orderItem.status = statusText;
                presentLoading.dismiss();
                if (statusText) {
                  this.orderStateChange.emit({ "value": statusText });
                }
              } else {
                presentLoading.dismiss();
              }
            }, (error) => {
              presentLoading.dismiss();
            });
          } else {
            presentLoading.dismiss();
          }
        }, (error) => {
          console.log(error)
          presentLoading.dismiss();
        });
      } else {
        presentLoading.dismiss();
      }
    })
  }

  async scheduleDelivery() {
    const modal = await this.modalCtrl.create({
      component: ScheduleTimePage,
      cssClass: 'schedule-time-component-css',
      componentProps: {
      }
    });
    modal.onDidDismiss().then((modelData: any) => {
      if (modelData !== null && modelData !== undefined && modelData !== "") {
        if (modelData.data.status == 'Yes') {
        }
        console.log('Modal Data : ' + modelData);
      }
    });
    await modal.present();
  }

  gotoOrderDetails(order) {
    this.router.navigate(['/order-details', order.orderID, order.status]);
  }
}
