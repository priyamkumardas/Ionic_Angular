import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/lib/services/storage.service';
import { OrderService } from 'src/app/lib/services/order.service';
import { CommonService } from 'src/app/lib/services/common.service';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { DateTimePickerComponent } from 'src/app/components/date-time-picker/date-time-picker.component';
import { Constants } from 'src/app/config/constants';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

export enum OrderStatus {
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  DELIVERY = 'DELIVERY',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
}

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  public isUpdateOrderItem: BehaviorSubject<any> = new BehaviorSubject<any>("");
  selectedSegment = OrderStatus.NEW;
  readonly OrderStatus = OrderStatus;
  orders: any = [];
  segmentTime: any;
  isLoading = false;
  selectedDay: any;
  helpVideo: any;
  activeNav = 'All';
  limit = 5; //limit for getting number of order's from api (pagination)...
  offset = 0; //offset is a index which we are sending to get data from particular index (pagination)...
  allOrders: any = []; //all orders listing...
  deliveryDate: any; //used for delivery date assigning in api for filtering...
  format = 'YYYY-MM-DD'; // to display date in this format...
  tabs = Object.values(OrderStatus); //for displaying orderStatus tabs in UI...
  todayDate = moment().format('YYYY-MM-DD'); //Today's date 

  constructor(
    private ngLocation: Location,
    public commonService: CommonService,
    public alertController: AlertController,
    private orderService: OrderService,
    private storageService: StorageService) {
    this.isUpdateOrderItem.subscribe((value) => {
      console.log(value);
      console.log(this.orders);
    });
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.segmentChanged(this.selectedSegment);
  }

  async ionViewWillLeave() {
    this.commonService.dismissToast()
  }

  async pullToRefresh(event) {
    this.segmentChanged(this.selectedSegment);
  }

  changeSegment(e) {
    if (this.segmentTime) {
      clearTimeout(this.segmentTime)
    }
    this.segmentTime = setTimeout(() => {
      this.segmentChanged(e);
    }, 1000);
  }

  segmentChanged(e) {
    console.log(e, this.selectedSegment);
    this.isLoading = true;
    this.orders = [];
    if (e?.target?.value) {
      const targetValue = e.target.value.toUpperCase();
      const validValues = ["DISPATCHED", "IN_TRANSIT", "PICKEDUP", "REACHED_DELIVERY_LOCATION"];
      if (validValues.includes(targetValue)) {
        this.selectedSegment = OrderStatus.DELIVERY;
      } else {
        this.selectedSegment = targetValue;
      }
    }
    this.offset = 0;
    this.activeDay(this.activeNav)
  }

  onIonInfinite(ev) {
    this.offset += 5;
    // ev.target.disabled = (this.selectedSegment == this.selectedSegment) || (this.deliveryDate == this.deliveryDate);
    this.orderService.getOrderStatusWise(this.selectedSegment, this.limit, this.offset, this.deliveryDate).subscribe((orders: any) => {
      this.isLoading = false;
      if (orders.data?.length == 0) {
        this.commonService.toast("No more order's available!");
        // ev.target.disabled = true;
      } else if (orders.data?.length != 0) {
        this.orders = []
        this.orders = orders.data
        this.allOrders.push(...this.orders);
        console.log(this.allOrders)
      }
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, (error) => {
      this.commonService.dismiss();
      this.isLoading = false
    });
  }

  changeTab(tab) {
    console.log(tab.value)
    this.changeSegment(this.selectedSegment);
  }

  getOrdersAccordingToCurrentSegment(currentSegment, deliveryDate?) {
    this.deliveryDate == undefined ? this.deliveryDate = 'All' : '';
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.orderService.getOrderStatusWise(currentSegment, this.limit, this.offset, this.deliveryDate).subscribe((orders: any) => {
        loading.dismiss()
        this.isLoading = false;
        if (orders.data?.length == 0) {
          this.commonService.toast("No data available, please try again later.");
        } else if (orders.data?.length != 0) {
          this.orders = []
          this.orders = orders.data
          this.allOrders.push(...this.orders);
          console.log(this.allOrders)
          // this.activeDay(this.activeNav);
        }
      }, (error) => {
        loading.dismiss()
        this.commonService.dismiss();
        this.isLoading = false
      });
    })
  }

  //Date filter on order's...
  activeDay(day) {
    this.allOrders = []; //clearing allOrder's array as when filter is applied then we're getting data from the api..
    this.offset = 0; //resetting offset as filter was applied so we need to get data from 0th index
    this.activeNav = day;
    const deliveryDate = this.getDeliveryDate(day);
    this.deliveryDate = deliveryDate;
    console.log(deliveryDate, this.deliveryDate);
    this.getOrdersAccordingToCurrentSegment(this.selectedSegment, deliveryDate);
  }

  getDeliveryDate(day) {
    switch (day) {
      case 'All':
        return 'All';
      case 'Today':
        return moment().format('YYYY-MM-DD');
      case 'Tomorrow':
        return moment().add(1, 'day').format('YYYY-MM-DD');
      default:
        return day.value;
    }
  }    
  // Define helper methods to improve readability and maintainability
  isDateFilterActive() {
    return this.activeNav !== 'All' && this.activeNav !== 'Today' && this.activeNav !== 'Tomorrow';
  }
  
  isDateFilter() {
    return this.activeNav === 'All' || this.activeNav === 'Today' || this.activeNav === 'Tomorrow';
  }
  
  onBack() {
    this.ngLocation.back();
  }

  async openHelpVideo() {
    this.helpVideo = this.storageService.getItem(Constants.HELP_VIDEOS);
    this.commonService.openHelpVideo(this.helpVideo.Order)
  }
  
  // active(day) {
  //   if (!this.orderList) {
  //     return;
  //   }
  
  //   switch(day) {
  //     case 'All':
  //       this.selectDay(day);
  //       this.orders = this.orderList.data;
  //       break;
  //     case 'Today':
  //       this.selectDay(day);
  //       this.orders = this.filterOrdersByDate(day);
  //       break;
  //     case 'Tomorrow':
  //       this.selectDay(day);
  //       this.orders = this.filterOrdersByDate(day);
  //       break;
  //     case day?.clear === 'clear':
  //       this.selectDay('All');
  //       this.changeSegment(this.selectedSegment);
  //       break;
  //     case day?.type === 'date':
  //       this.selectDay(day.value);
  //       this.defaultDate = new Date(day.value).toISOString().substring(0, 10);
  //       this.orders = this.filterOrdersByDate(day.value);
  //       break;
  //     default:
  //       break;
  //   }
  // }
  
  // selectDay(day) {
  //   this.selectedDay = day;
  //   this.activeNav = day;
  // }
  
  // filterOrdersByDate(day) {
  //   return this.orderList.data.filter((order) => {
  //     let orderDate = moment.utc(order.delivery.deliveryDate).format('DD/MM/YYYY');
  //     let localDate = moment().format('DD/MM/YYYY');
  
  //     switch(day) {
  //       case 'Today':
  //         return orderDate === localDate;
  //       case 'Tomorrow':
  //         let tomorrowDate = moment().add(1, 'd').format('DD/MM/YYYY');
  //         return orderDate === tomorrowDate;
  //       default:
  //         return true;
  //     }
  //   });
  // }
  
}
