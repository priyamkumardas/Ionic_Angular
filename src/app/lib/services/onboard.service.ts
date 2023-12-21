import { Injectable } from '@angular/core';
import { forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CommonApi } from './api/common.api';
import { CommonService } from './common.service';
import { environment } from 'src/environments/environment';
import { ApiUrls } from 'src/app/config/constants';

@Injectable({
  providedIn: 'root'
})
export class OnboardService {

  shopAdded;

  constructor(private commonService: CommonService,
    private commonApi: CommonApi,) { }

  /* Add New Catalog */
  addNewCatalogDetails(body, shopid) {
    return this.commonApi.postData(ApiUrls.catalog.catelog + shopid, body).pipe(catchError((err) => this.errorHandler(err)));
  }

  addNewShopDetails(body, shopId) {
    if (shopId === null) {
      return this.commonApi.postData(ApiUrls.shopDetails.shop.addshop, body);
    } else {
      return this.commonApi.putData(ApiUrls.shopDetails.shop.updateShopDetails + '/' + shopId, body);
    }
  }

  addShopWorkingTime(shopid, body) {
    return this.commonApi.addShopWorkingTime(shopid, body).pipe(catchError((err) => this.errorHandler(err)));
  }

  /* ----- For KYC ---- */
  
  /* get all document URL for KYC */

  getUploadKYCURL(docType: any) {
   return this.commonApi.getUploadKYCURL(docType).pipe(catchError((err) => this.errorHandler(err)));
  }

  /* final form-data upload for KYC */
  addKYCFormDetals(body: any) {
   return this.commonApi.addKYCDetails(body).pipe(catchError((err) => this.errorHandler(err)));
  }

  getKYCDetail() {
    return this.commonApi.getKYCDetails().pipe(catchError((err) => this.errorHandler(err)));
  }


  /* ----- For Bank ---- */

  /* get all document URL for Bank */
  getBankPassbookURL() {
    return this.commonApi.getBankPassbookLink().pipe(catchError((err) => this.errorHandler(err)));
  }

  /* final form-data upload for KYC */
  addBankFormDetals(body) {
    return this.commonApi.addBankDetails(body).pipe(catchError((err) => this.errorHandler(err)));
  }

  addGstNo(body, shopId) {
    return this.commonApi.postData(`${ApiUrls.shopDetails.shop.addshop}/${shopId}/gst`, body).pipe(catchError((err) => this.errorHandler(err)));
  }

  getShopDetails(shopId) {
    return this.commonApi.getData(`${ApiUrls.shopDetails.shop.getShopDetails}/${shopId}`).pipe(catchError((err) => this.errorHandler(err)));
  }

  getShopOwnerDetails(shopId) {
    return this.commonApi.getData(`${ApiUrls.shopDetails.shop.getShopOwnerDetails}/${shopId}`).pipe(catchError((err) => this.errorHandler(err)));
  }

  getUserDetails(userId) {
    return this.commonApi.getData(`${ApiUrls.userDetails.getUserDetails}/${userId}`).pipe(catchError((err) => this.errorHandler(err)));
  }

  getGstDetails(shopId) {
    return this.commonApi.getData(`${ApiUrls.shopDetails.kyc.getGstDetails}/${shopId}/gst`).pipe(catchError((err) => this.errorHandler(err)));
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
