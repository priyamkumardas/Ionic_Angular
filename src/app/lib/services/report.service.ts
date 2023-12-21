import { Injectable } from '@angular/core';
import { CommonApi } from './api/common.api';
import { ApiUrls, Constants } from 'src/app/config/constants';
import { CommonService } from './common.service';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { SMS } from '@awesome-cordova-plugins/sms/ngx';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  referral_mgmt = {
    referrals: environment.baseUrl + '/ref_ms/apis/v1/ref',
  };

  // Userapplink = 'https://play.google.com/store/apps/details?id=com.sarvm.hh&hl=en-US&ah=uI6maScqUW8bclH7s_fV8-tJw58';
  // Retailerapplink = 'https://play.google.com/store/apps/details?id=com.sarvm.biz&hl=en-US&ah=uI6maScqUW8bclH7s_fV8-tJw58';
  // Logisticapplink = 'https://play.google.com/store/apps/details?id=com.sarvm.loga&hl=en-US&ah=uI6maScqUW8bclH7s_fV8-tJw58';
  appLink = environment.sarvmAllApps.publicPage


  Individual_Message_BODY = `Hey! Check out SarvM.AI, an app digitizing the food supply chain. Download the app now  ${this.appLink}. Give miss call at  ${environment.refferal.ackPhonenumber}  to acknowledge.`;
  Retailer_Message_BODY = `Hey! Check out SarvM.AI Retailer, an app digitizing the food supply chain. Download the app now  ${this.appLink}. Give miss call at  ${environment.refferal.ackPhonenumber}  to acknowledge.`;
  Logistic_Message_BODY = `Hey! Check out SarvM.AI Logistics app. Download the app now  ${this.appLink}. Give miss call at  ${environment.refferal.ackPhonenumber}  to acknowledge.`;


  constructor(private commonApi: CommonApi,
    public commonService: CommonService,
    private storageService: StorageService,
    private http: HttpClient,
    private sms: SMS,
  ) { }

  sendSms(phone, message) {
    const options = {
      replaceLineBreaks: false, // true to replace \n by a new line, false by default
      android: {
        intent: 'INTENT'  // send SMS with the native android SMS messaging
        // intent: '' // send SMS without opening any other app
      }
    };
    this.sms.send(phone, message, options).then(() => {
      this.commonService.success('message has been sent');
    })
      .catch(error => {
        this.commonService.danger('Failed: ' + error);
      });
  }

  myReferralsList() {
    return this.http.get(this.referral_mgmt.referrals);
  }

  getAllExistingCustomers(startDate, endDate) {
    const storeId =
      this.commonService.getUserData() &&
        this.commonService.getUserData().shopId
        ? this.commonService.getUserData().shopId
        : this.storageService.getItem(Constants.SHOP_ID)
          ? this.storageService.getItem(Constants.SHOP_ID)
          : this.commonService.getUserData().userId;

    const url = `${ApiUrls.topCustomerReport.existingCustomers}${storeId}?startDate=${startDate}&endDate=${endDate}`;

    return this.commonApi.getData(url);
  }

  getCustomerDetail(startDate, endDate, userId) {
    const storeId =
      this.commonService.getUserData() &&
        this.commonService.getUserData().shopId
        ? this.commonService.getUserData().shopId
        : this.storageService.getItem(Constants.SHOP_ID)
          ? this.storageService.getItem(Constants.SHOP_ID)
          : this.commonService.getUserData().userId;

    const url = `${ApiUrls.topCustomerReport.customerDetail}${storeId}/${userId}?startDate=${startDate}&endDate=${endDate}`;
    return this.commonApi.getData(url);
  }
}
