import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { GenericApi } from './shared/generic.api';
import { ApiUrls } from 'src/app/config/constants';
@Injectable()
export class CommonApi extends GenericApi {
  
  private headers = new HttpHeaders({
    skip: 'true',
  });
  private skipHttpCall = { headers: this.headers };

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * @name getDataByUrl
   * @type Value-returning function - Call APi to get Data by URL
   **/
  getDataByUrl(url) {
    return this.get(url);
  }

  getAllLanguage() {
    return this.get(environment.baseUrl + ApiUrls.splash);
  }

  getCDNLink(selectUrl) {
    return this.get(`${selectUrl}`, this.skipHttpCall);
  }

  getData(url) {
    return this.get(environment.baseUrl + url);
  }

  postData(url, data) {
    return this.post(environment.baseUrl + url, data);
  }

  putData(url, data) {
    return this.put(environment.baseUrl + url, data);
  }

  addShopWorkingTime(shopid, body) {
    return this.post(`${environment.baseUrl + ApiUrls.shopDetails.shop.addShopTime}/${shopid}`, body);
  }

  /* For KYC */
  getUploadKYCURL(docType: any) {
    if(docType == 'aadhar'){
      return this.get(`${environment.baseUrl + ApiUrls.shopDetails.kyc.getUploadAadhar}`);
    } else {
      return this.get(`${environment.baseUrl + ApiUrls.shopDetails.kyc.getUploadPan}`);
    }
  }

  addKYCDetails(body) {
    return this.post(`${environment.baseUrl + ApiUrls.shopDetails.kyc.getKycDetails}`, body);
  }

  getKYCDetails() {
    return this.get(`${environment.baseUrl + ApiUrls.shopDetails.kyc.getKycDetails}`);
  }

  /* For Bank */
  getBankPassbookLink() {
    return this.get(`${environment.baseUrl + ApiUrls.shopDetails.bank.getBankURLDOC}`);
  }

  addBankDetails(body) {
    return this.post(`${environment.baseUrl + ApiUrls.shopDetails.bank.addBank}`, body);
  }

  /* Subscription - Razorpay*/
  createSubscription(body: any){
    return this.post(`${environment.baseUrl + ApiUrls.subscription.createSubscription}`, body);
  }

  confirmSubscription(body: any){
    return this.post(`${environment.baseUrl + ApiUrls.subscription.confirmSubscription}`, body);
  }

  getAllSubscription(subscripId: any){
    return this.get(`${environment.baseUrl + ApiUrls.subscription.getAllSubscription}${subscripId}`);
  }

  checkStatusSubscription(subscripId: any){
    return this.get(`${environment.baseUrl + ApiUrls.subscription.checkStatus}${subscripId}`);
  }

  deleteData(url) {
    console.log(url);
    return this.delete(environment.baseUrl + url);
  }

  getSubscriptionsPackageList() {
    return this.get(`${environment.baseUrl + ApiUrls.subscription.SubscriptionsPackageList}`);
  }
}
