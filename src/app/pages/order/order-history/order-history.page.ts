import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/lib/services/storage.service';
import { OrderService } from 'src/app/lib/services/order.service';
import { CommonService } from 'src/app/lib/services/common.service';
import { Router } from '@angular/router';
import { DateTimePickerComponent } from 'src/app/components/date-time-picker/date-time-picker.component';
import { Constants } from 'src/app/config/constants';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

export enum OrderStatus {
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  Rejected = 'REJECTED',
  NoShow = 'NO_SHOW',
  PendingPayment = 'PAYMENT_PENDING',
}

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage implements OnInit {
  segment;
  tabs = Object.keys(OrderStatus);
  statusSegment = OrderStatus.Completed;
  ordersData: any = [];
  isLoading = false;
  searchLang;
  orderList: any = [];
  activeNav: any = 'All';
  format = 'YYYY-MM-DD';
  segmentTime: any;
  initiallyDefinedDate;
  helpVideo: any;
  dateCondition = {
    max: '',
    min: ''
  };
  today;
  limit = 5;
  offset = 0;
  deliveryDate: any = moment().format('YYYY-MM-DD');
  allOrders: any = []; //all orders listing...
  todayDate = moment().format('YYYY-MM-DD'); //Today's date 

  constructor(
    public commonService: CommonService,
    private orderService: OrderService,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.segment = '0';
    this.today = this.getCurrentDate();
    this.dateCondition.max = this.today;
  }

  ionViewWillEnter() {
    this.segment = '0';
    // this.orderStatusCheck(this.statusSegment);
    // this.activeDay(this.defaultDate)
    this.activeDay(this.activeNav)
  }

  async ionViewWillLeave() {
    this.commonService.dismissToast()
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  getCurrentDate(format: string = 'YYYY-MM-DD') {
    return moment().format(this.format);
  }

  async pullToRefresh(event) {
    this.allOrders = [];
    this.offset = 0;
    this.orderStatusCheck(this.statusSegment);
  }

  changeOrderSegment(status: any) {
    this.allOrders = [];
    this.searchLang = undefined;
    if (this.segmentTime) {
      clearTimeout(this.segmentTime)
    }
    this.segmentTime = setTimeout(() => {
      this.orderStatusCheck(status);
    }, 500);
    this.offset = 0;
  }

  onIonInfinite(ev) {
    this.offset += 5;
    this.orderService.getOrderStatusWise(this.statusSegment, this.limit, this.offset, this.deliveryDate, this.searchLang).subscribe((orders: any) => {
      this.isLoading = false
      if (orders.data?.length == 0) {
        this.commonService.toast("No more order's available!");
      } else if (orders.success == true && orders.data != undefined && orders.data?.length != 0) {
        this.ordersData = orders.data;
        this.orderList = orders;
        this.allOrders.push(...this.ordersData);
        console.log(this.ordersData, this.orderList)
        // Check for searched oder in status tab
        // if (this.searchLang != undefined) {
        //   this.searchFunction();
        // }
      }
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, (error) => {
      console.log(error)
      this.commonService.dismiss();
      this.isLoading = false;
      (ev as InfiniteScrollCustomEvent).target.complete();
    });
  }

  orderStatusCheck(status: any, deliveryDate?) {
    this.ordersData = [];
    this.orderList = [];
    this.statusSegment = status;
    console.log(this.statusSegment);
    this.isLoading = true
    this.deliveryDate == undefined ? this.deliveryDate = 'All' : '';
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.orderService.getOrderStatusWise(this.statusSegment, this.limit, this.offset, this.deliveryDate, this.searchLang).subscribe((orders: any) => {
        loading.dismiss()
        this.isLoading = false
        if (orders.data?.length == 0) {
          this.commonService.toast("No data available, please try again later.");
        } else if (orders.success == true && orders.data != undefined && orders.data?.length != 0) {
          this.ordersData = orders.data;
          this.orderList = orders;
          this.allOrders.push(...this.ordersData);
          console.log(this.ordersData, this.orderList)
          // if (this.searchLang != undefined) {
          //   this.searchFunction();
          // }
        }
      }, (error) => {
        loading.dismiss()
        console.log(error)
        this.isLoading = false;
      });
    })
  }

  searchFunction() {
    this.ordersData = [];
    this.orderList = [];
    this.allOrders = [];
    this.offset = 0;
    console.log(this.searchLang);
    if (this.searchLang != undefined) {
      this.commonService.presentProgressBarLoading()
      this.orderService.getOrderStatusWise(this.statusSegment, this.limit, this.offset, this.deliveryDate, this.searchLang).subscribe((orders: any) => {
        this.commonService.closeProgressBarLoading()
        if (orders.data?.length == 0) {
          this.commonService.toast("No data available, please try again later.");
        } else if (orders.success == true && orders.data != undefined && orders.data?.length != 0) {
          this.ordersData = orders.data;
          this.orderList = orders;
          this.allOrders.push(...this.ordersData);
        }
      }, (error) => {
        this.commonService.closeProgressBarLoading()
        console.log(error)
      });
    }
    /*
      this.ordersData = this.allOrders.filter((lang) => {
        if (lang.orderID?.toLowerCase()?.includes(this.searchLang.toLowerCase())) {
          return lang;
        }
        if (lang.userDetails?.phone?.toLowerCase().includes(this.searchLang.toLowerCase())) {
          return lang;
        }
      });
    */
  }

  activeDay(day) {
    this.allOrders = []; //clearing allOrder's array as when filter is applied then we're getting data from the api..
    this.offset = 0; //resetting offset as filter was applied so we need to get data from 0th index
    // this.searchLang = undefined;
    this.activeNav = day;
    const deliveryDate = this.getDeliveryDate(day);
    this.deliveryDate = deliveryDate;
    console.log(deliveryDate, this.deliveryDate);
    this.orderStatusCheck(this.statusSegment, deliveryDate);
  }

  getDeliveryDate(day) {
    switch (day) {
      case 'All':
        return 'All';
      case 'Today':
        return moment().format('YYYY-MM-DD');
      case 'Yesterday':
        return moment().subtract(1, 'day').format('YYYY-MM-DD');
      default:
        return day.value;
    }
  }

  isDateFilterActive() {
    return this.activeNav !== 'All' && this.activeNav !== 'Today' && this.activeNav !== 'Tomorrow';
  }

  isDateFilter() {
    return this.activeNav === 'All' || this.activeNav === 'Today' || this.activeNav === 'Tomorrow';
  }

  checkForSerachedOrders(currentOrders) {
    if (currentOrders.orderID.toLowerCase().includes(this.searchLang?.toLowerCase())) {
      return currentOrders;
    }
    if (currentOrders.userDetails.phone.toLowerCase().includes(this.searchLang?.toLowerCase())) {
      return currentOrders;
    }
  }

  onBack() {
    this.router.navigate(['/order']);
  }

  async openHelpVideo() {
    this.helpVideo = this.storageService.getItem(Constants.HELP_VIDEOS);
    this.commonService.openHelpVideo(this.helpVideo.Order)
  }
}
