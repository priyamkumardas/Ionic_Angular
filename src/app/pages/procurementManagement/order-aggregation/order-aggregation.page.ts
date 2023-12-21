import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/lib/services/common.service';
import { OrderService } from 'src/app/lib/services/order.service';
import { Constants } from 'src/app/config/constants';
import { StorageService } from 'src/app/lib/services/storage.service';
@Component({
  selector: 'app-order-aggregation',
  templateUrl: './order-aggregation.page.html',
  styleUrls: ['./order-aggregation.page.scss'],
})
export class OrderAggregationPage implements OnInit {
  utcToItc = new Date().getTime() + 19800000 //for conversion utc to itc (19800000 is milliseconds in 5 hours 30 minutes....because IST is 05:30 ahead of UTC)
  today = new Date(this.utcToItc).toJSON() //to get today's date
  selectedDate: any;
  ordersList: any // to display list of all the order's coming from api
  totalItems: any;
  totalWeight: any;
  totalPieces: any;
  totalLiter: any;
  totalPlates: any;
  apiResponse: any; //for ion-skeleton loading
  arrayOfDates = []; //for displaying dates on template
  // arrayOfDays = ['S','M','T','W','T','F','S'];
  constructor(
    private orderService: OrderService,
    public commonService: CommonService,
    private storageService: StorageService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getData(new Date(this.utcToItc).toJSON().split('T')[0]) //whenever user will enter in this page it'll call api for today's date
    this.selectedDate = new Date(this.utcToItc).toJSON().split('T')[0]
    this.getDisplayDateandDay()
  }

  /**
   * to generate next 7day's date from today in indian standard time
   * values used in below function :- 
   * 86400000 = milliseconds in a day i.e. Eight crore sixty four lakh
   * 19800000 = means IST is ahead of 5:30 hours from UTC now converting 5 hours 30 minutes in milliseconds
   * which gives us this value 19800000 i.e around One Crore Ninety Eight Lakh 
   * 
   */
  getDisplayDateandDay() {
    let currentDate = new Date();
    this.arrayOfDates = [];
    for (let i = 0; i < 7; i++) {
      let date = new Date(currentDate.getTime() + (19800000 + (86400000 * i)))
      this.arrayOfDates.push(date);
    }
  }

  /**
   * getData() function will call order aggregation api when user changes date displayed in the template.
  */
  getData(data) {
    this.apiResponse = false; // skeleton loading
    this.selectedDate = data
    console.log(data, this.selectedDate)

    //fetching shopId
    const shopId = this.commonService.getUserData() && this.commonService.getUserData().shopId
      ? this.commonService.getUserData().shopId : this.storageService.getItem(Constants.SHOP_ID)
        ? this.storageService.getItem(Constants.SHOP_ID) : this.commonService.getUserData().userId;

    //api call
    this.commonService.presentLoader().then(loading => {
      loading.present()
    // this.commonService.presentProgressBarLoading() //progressBar loading starts
    this.orderService.getOrderAggregation(shopId, this.selectedDate, this.selectedDate).subscribe((res: any) => {
      loading.dismiss()
      res.success ? this.apiResponse = true : this.apiResponse = false; //checking api response if it's true.
      // this.commonService.closeProgressBarLoading() //progressBar Loading ends
      this.ordersList = res.data?.aggregateOrders?.orders //to display list of orders
      this.totalItems = res.data?.aggregateOrders?.totalItems //to display total number of orders
      this.totalWeight = res.data?.aggregateOrders?.totalWeight //to display totalWeight
      this.totalLiter = res.data?.aggregateOrders?.totalLiter //to display totalLiter
      this.totalPieces = res.data?.aggregateOrders?.totalPieces //to display totalPieces
      this.totalPlates = res.data?.aggregateOrders?.totalPlates //to display totalPlates
      // console.log(this.ordersList)
    }, err => {
      this.commonService.danger(err.error.error.message) //If api throws error then it will show a toast 
      // this.commonService.closeProgressBarLoading() //progressBar Loading ends
      loading.dismiss()
    })
  })
  }
}
