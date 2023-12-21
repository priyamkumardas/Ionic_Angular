import { Injectable } from '@angular/core';
import { CommonApi } from 'src/app/lib/services/api/common.api';
import { environment } from 'src/environments/environment';
import { ApiUrls, Constants } from 'src/app/config/constants';
import { StorageService } from './storage.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private commonApi: CommonApi, private storageservice: StorageService, private commonService: CommonService) { }
  getUid() {
    console.log(this.commonService.parseJwt(this.storageservice.getItem(Constants.AUTH_TOKEN)).userId)
    return this.commonService.parseJwt(this.storageservice.getItem(Constants.AUTH_TOKEN)).userId
  }
  getUserImageUploadUrl() {
    return this.commonApi.getDataByUrl(environment.baseUrl + ApiUrls.image);
  }
  getUserDetails() {
    return this.commonApi.getData(`${ApiUrls.userDetails.user}/${this.getUid()}`);
  }
  getUserProfileImageUploadUrl() {
    return this.commonApi.getDataByUrl(environment.baseUrl + ApiUrls.userDetails.profileUpload);
  }

  addUserDetails(formData) {
    return this.commonApi.putData(`${ApiUrls.userDetails.user}/${this.getUid()}`, formData);
  }
  addDeliveryBoy(formData) {
    return this.commonApi.postData(`${ApiUrls.addDeliveryBoy}`, formData);
  }
  updateDeliveryBoy(formData) {
    return this.commonApi.putData(`${ApiUrls.laUpdateUser}`, formData);

  }
  getQrCodeImageUploadUrl() {
    return this.commonApi.getDataByUrl(environment.baseUrl + ApiUrls.userDetails.qrCodeUpload);
  }

   // User UPI Data

   getUPI(userId) {
    return this.commonApi.getData(`${ApiUrls.userDetails.retailerUpi}/${userId}/paymentInfo`);
  }

  createUPI(userId, form) {
    return this.commonApi.postData(`${ApiUrls.userDetails.retailerUpi}/${userId}/paymentInfo`, form);
  }

  updateUPI(retailerId, paymentInfoId, form){
    return this.commonApi.putData(`${ApiUrls.userDetails.retailerUpi}/${retailerId}/paymentInfo/${paymentInfoId}`, form);
  }

  deleteUPI(retailerId, paymentInfoId){
    return this.commonApi.deleteData(`${ApiUrls.userDetails.retailerUpi}/${retailerId}/paymentInfo/${paymentInfoId}`);
  }
  
  getDeliveryBoyById(id) {
    return this.commonApi.getData(`${ApiUrls.laUserById}/${id}`);
  }

  deleteAccount(id: any) {
    return this.commonApi.deleteData(`${ApiUrls.userDetails.user}/${id}`);
  }
}
