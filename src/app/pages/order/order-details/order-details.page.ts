import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ModalController, Platform, ActionSheetController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/lib/services/order.service';
import { CommonService } from 'src/app/lib/services/common.service';
import { DispatchModalComponent } from 'src/app/components/dispatch-modal/dispatch-modal.component';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { CancelOrderModalComponent } from '../cancel-order-modal/cancel-order-modal.component';
import { Constants } from 'src/app/config/constants';
import { StorageService } from 'src/app/lib/services/storage.service';

export enum OrderStatus {
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  DELIVERY = 'DELIVERY',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  IN_TRANSIT = "IN_TRANSIT",
  PICKEDUP = 'PICKEDUP',
  REACHED_DELIVERY_LOCATION = 'REACHED_DELIVERY_LOCATION',
  DISPATCHED = "DISPATCHED"
}



@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {

  value;
  modelData;


  title: any;
  orderStatus = OrderStatus;
  orderId: string;
  order: any;
  status: any;
  titleText: any;
  okayButton: any;
  sendStatusText: any = "Hello";
  clickDisable
  helpVideo: any;
  
  constructor(private ngLocation: Location,
    private router: Router,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private commonService: CommonService,
    private orderService: OrderService,
    private actionSheetCtrl: ActionSheetController,
    private inAppBrowser: InAppBrowser,
    private platform: Platform,
    private storageService: StorageService,
  ) {
    this.route.params.subscribe((res) => {
      this.orderId = res.orderId;
      // console.log(this.orderId);
      // this.status = res.orderStatus;
      if (res.orderStatus != null && res.orderStatus != undefined && res.orderStatus != "") {
        this.title = res.orderStatus.charAt(0).toUpperCase() + res.orderStatus.slice(1).toLowerCase() + " Order Details";
      } else {
        this.title = "Order Details";
      }
    });
  }

  ngOnInit() {
    this.okayButton = this.router.getCurrentNavigation().extras.state
      ? this.router.getCurrentNavigation().extras.state.page
      : null;
    this.getOrderDetails();
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.getOrderDetails();
      event.target.complete();
    }, 500);
  };

  openWithInAppBrowser(url) {
    let latlon = url.delivery?.location?.lat + ',' + url.delivery?.location?.lon
    if (this.platform.is('ios')) {
      this.inAppBrowser.create('maps://?q=' + latlon, '_system');
    } else {
      let label = encodeURI(url.user?.name + ' location');
      this.inAppBrowser.create('geo:0,0?q=' + latlon + '(' + label + ')', '_system');
    }
  }

  getOrderDetails() {
    if (this.orderId != null && this.orderId != undefined && this.orderId != "") {
      this.commonService.presentLoader().then(presentLoading => {
        presentLoading.present()
        this.orderService.getOrderByIdDetails(this.orderId).subscribe((order: any) => {
          if (order.success == true && order.data != null && order.data != undefined) {
            this.order = order.data;
            this.status = order.data?.status
            presentLoading.dismiss();
          } else {
            presentLoading.dismiss();
          }
        }, (error) => {
          presentLoading.dismiss();
          // this.commonService.danger(error);
        });
      })
    }
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
            this.getOrderDetails()
            orderItem.status = statusText;
            presentLoading.dismiss();
          } else {
            presentLoading.dismiss();
          }
        }, (error) => {
          console.log(error)
          this.getOrderDetails()
          presentLoading.dismiss();
        });
      } else {
        presentLoading.dismiss();
      }
    })
  }

  changeOrderStatus(orderItem: any, statusText: string) {
    statusText == 'DISPATCHED' ? this.openDispatchModal(orderItem, statusText) : this.changeOrderStatusModal(orderItem, statusText)
  }

  async changeOrderStatusModal(orderItem: any, statusText: string) {
    this.clickDisable = 'disableClick';
    if (statusText == 'Received') {
      this.confirmPayment(orderItem, statusText)
    }
    else {
      console.log(statusText, 'statusText')
      const modal = await this.modalCtrl.create({
        component: CancelOrderModalComponent,
        cssClass: 'cancel-order-modal',
        componentProps: {
          'orderType': statusText,
          isOrder: false
        }
      });
      modal.onDidDismiss().then((modelData: any) => {
        this.clickDisable = '';
        if (modelData !== null && modelData !== undefined && modelData !== "" && modelData.data != undefined) {
          if (modelData.data.status == 'Yes') {
            this.orderStatusChangeView(orderItem, statusText);
          }
          console.log(modelData);
        }
      });
      await modal.present();
    }
  }

  async openDispatchModal(orderItem: any, statusText: string) {
    this.clickDisable = 'disableClick';
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
      if (modelData !== null && modelData !== undefined && modelData !== "" && modelData.data != undefined) {
        this.orderStatusChangeView(orderItem, statusText);
      }
    });
    await modal.present();
    this.clickDisable = '';
  }

  async openReDispatchModal(orderItem: any, statusText: string) {
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
        this.orderStatusChangeView(orderItem, statusText);
      }
    });
    await modal.present();
  }

  async confirmPayment(orderItem: any, statusText: string) {
    this.clickDisable = 'disableClick';
    const modal = await this.modalCtrl.create({
      component: CancelOrderModalComponent,
      cssClass: 'cancel-order-modal',
      componentProps: {
        amount: orderItem.delivery.mode == 'PICKUP' ? this.order?.amountAfterDiscount : this.order?.amountAfterDiscount + parseFloat(orderItem?.delivery?.deliveryCharges),
        'orderType': statusText,
        isOrder: true
      }
    });
    modal.onDidDismiss().then((modelData: any) => {
      this.clickDisable = '';
      if (modelData !== null && modelData !== undefined && modelData !== "" && modelData.data != undefined) {
        if (modelData.data.status == 'Yes') {
          this.checkPaymentAcknowledgement(orderItem);
        }
        console.log('Modal Data : ' + modelData);
      }
    });
    await modal.present();
  }

  checkPaymentAcknowledgement(orderItem: any) {
    if (orderItem.orderID != null && orderItem.orderID != undefined && orderItem.orderID != "") {
      let paymentOrder = {
        "acknowledged": true
      }
      this.orderService.updatePaymentStatus(orderItem.orderID, paymentOrder).subscribe((order: any) => {
        if (order.success) {
          this.ngLocation.back();
        }
      }, (error) => {
        // this.commonService.danger(error);
      });
    }
  }

  async openCancelModal(orderItem: any, statusText: string) {
    this.clickDisable = 'disableClick';
    const modal = await this.modalCtrl.create({
      component: CancelOrderModalComponent,
      cssClass: 'cancel-order-modal',
      componentProps: {
        'orderType': statusText,
      }
    });
    modal.onDidDismiss().then((modelData: any) => {
      if (modelData !== null && modelData !== undefined && modelData !== "") {
        if (modelData.data.status == 'Yes') {
          this.orderStatusChangeView(orderItem, statusText);
        }
        console.log(modelData);
      }
    });
    await modal.present();
    this.clickDisable = '';
  }

  getCharector(str: any) {
    return str.charAt(0) + str.charAt(str.indexOf(' ') + 1)
  }

  onBack() {
    this.ngLocation.back();
  }

  async openAction(orderItem) {
    console.log(orderItem);
    let tempButtons = [
      {
        text: 'Accept',
        data: {
          action: '',
        },
        handler: () => {
          this.changeOrderStatusModal(orderItem, 'ACCEPTED')
        }
      },
      {
        text: 'Process',
        data: {
          action: '',
        },
        handler: () => {
          this.changeOrderStatusModal(orderItem, 'PROCESSING')
        }
      },
      {
        text: 'Ready',
        data: {
          action: '',
        },
        handler: () => {
          this.changeOrderStatusModal(orderItem, 'READY')
        }
      },
      {
        text: 'Dispatch',
        data: {
          action: '',
        },
        handler: () => {
          this.openDispatchModal(orderItem, 'DISPATCHED')
        }
      },
      {
        icon: 'close-outline',
        role: 'cancel',
        data: {
          action: 'cancel'
        }
      },
    ]
    if (this.status == 'ACCEPTED') { tempButtons.splice(0, 1) }
    if (this.status == 'PROCESSING') { tempButtons.splice(0, 2) }
    if (this.status == 'READY') { tempButtons.splice(0, 3) }
    if (this.status == 'DISPATCHED') { tempButtons.splice(0, 4) }
    const actionSheet = await this.actionSheetCtrl.create({
      mode: 'ios',
      cssClass: 'order-popup',
      buttons: tempButtons,
    });
    await actionSheet.present();
  }

  // for pickup
  async openActionPickup(orderItem) {
    console.log(orderItem);
    let tempButtons = [
      {
        text: 'Accept',
        data: {
          action: '',
        },
        handler: () => {
          this.changeOrderStatusModal(orderItem, 'ACCEPTED')
        }
      },
      {
        text: 'Process',
        data: {
          action: '',
        },
        handler: () => {
          this.changeOrderStatusModal(orderItem, 'PROCESSING')
        }
      },
      {
        text: 'Ready',
        data: {
          action: '',
        },
        handler: () => {
          this.changeOrderStatusModal(orderItem, 'READY')
        }
      },
      {
        text: 'Pickup',
        data: {
          action: '',
        },
        handler: () => {
          this.changeOrderStatusModal(orderItem, 'DELIVERY')
        }
      },
      {
        icon: 'close-outline',
        role: 'cancel',
        data: {
          action: 'cancel'
        }
      },
    ]
    if (this.status == 'ACCEPTED') { tempButtons.splice(0, 1) }
    if (this.status == 'PROCESSING') { tempButtons.splice(0, 2) }
    if (this.status == 'READY') { tempButtons.splice(0, 3) }
    if (this.status == 'DISPATCHED') { tempButtons.splice(0, 4) }
    const actionSheet = await this.actionSheetCtrl.create({
      mode: 'ios',
      cssClass: 'order-popup',
      buttons: tempButtons,
    });
    await actionSheet.present();
  }

  async openHelpVideo() {
    this.clickDisable = 'disableClick';
    this.helpVideo = this.storageService.getItem(Constants.HELP_VIDEOS);
    this.commonService.openHelpVideo(this.helpVideo.Order)
    this.clickDisable = '';
  }
}
