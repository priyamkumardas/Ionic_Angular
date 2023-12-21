import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonApi } from './api/common.api';
import { CommonService } from './common.service';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';
import { ApiUrls } from 'src/app/config/constants';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  updateOrderItem: any;



  constructor(private commonApi: CommonApi,
    private commonService: CommonService,
    private modalCtrl: ModalController,
  ) { }

  getDelBoyList() {
    return this.commonApi.getData(`${ApiUrls.getDboyList}`).pipe(catchError((err) => this.errorHandler(err)));
  }

  getUserCreatedDeliveryBoyList(shopId: any) {
    return this.commonApi.getData(ApiUrls.getUserCreatedDelBoy+ `${shopId}/deliveryBoys`).pipe(catchError((err) => this.errorHandler(err)));
  }

  selectDeliveryBoy(orderId: any, body: any) {
    console.log(orderId);
    return this.commonApi.postData(ApiUrls.assignOrder(orderId), body).pipe(catchError((err) => this.errorHandler(err)));
  }

  selectReDeliveryBoy(orderId: any, body: any) {
    return this.commonApi.postData(ApiUrls.reAssignOrder(orderId), body).pipe(catchError((err) => this.errorHandler(err)));
  }
  getOrderStatusWise(status: string, limit, offset, deliveryDate, orderQuery?) {
    orderQuery == undefined ? orderQuery = '' : orderQuery
    return this.commonApi.getDataByUrl(environment.baseUrl + ApiUrls.orders.getOrder + status +`&limit=${limit}&offset=${offset}&deliveryDate=${deliveryDate}&orderQuery=${orderQuery}`).pipe(catchError((err) => this.errorHandler(err)));
  }

  getOrderByIdDetails(orderId: string) {
    return this.commonApi.getDataByUrl(environment.baseUrl + ApiUrls.orders.getOrderById + orderId).pipe(catchError((err) => this.errorHandler(err)));
  }

  getOrderAggregation(shopId: any, startDate: any, endDate: any) {
    return this.commonApi.getDataByUrl(environment.baseUrl + ApiUrls.orders.getOrderAggregationbyId + `${shopId}?startDate=${startDate}&endDate=${endDate}`)
  }

  updateOrderStatus(orderId: any, body: any) {
    return this.commonApi.putData(ApiUrls.orders.updateOrderStatus + `${orderId}/status`, body).pipe(catchError((err) => this.errorHandler(err)));
  }

  updatePaymentStatus(orderId: any, body: any) {
    return this.commonApi.putData(ApiUrls.orders.updatePayment + `${orderId}/payment`, body).pipe(catchError((err) => this.errorHandler(err)));
  }

  getOrderDetails(orderId: string) {
    return this.commonApi.getDataByUrl(environment.baseUrl + ApiUrls.orders.getOrderById).pipe(catchError((err) => this.errorHandler(err)));
  }

  private errorHandler(err) {
    if (err.error.length >= 1) {
      this.commonService.danger(err.error[0].message);
    } else {
      this.commonService.danger(err.error.error.message);
    }
    return throwError(err);
  }
}
