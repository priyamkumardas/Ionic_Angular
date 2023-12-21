import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'src/app/config/constants';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Checkout } from 'capacitor-razorpay';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/lib/services/common.service';
import { PaymentService } from 'src/app/lib/services/payment.service';
import { Location } from '@angular/common';
import { DataUtils } from 'src/app/lib/utils/data.utils';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {

  subscripInfo: any;
  userAddress: any;
  invoiceNo: any;
  shopDetails: any;
  @Input() isModal: boolean;

  constructor(private router: Router,
    private ngLocation: Location,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    public commonService: CommonService,) {
    this.route.params.subscribe((res) => {
      this.subscripInfo = JSON.parse(atob(res.info));
      this.shopDetails = this.commonService.userData.shopMeta.shop;
      this.userAddress = this.shopDetails.street.concat(", ") + this.shopDetails.landmark.concat(", ") + this.shopDetails.city;
      this.invoiceNo = this.commonService.userData.phone + this.subscripInfo.startDate.slice(3, 5).concat(this.subscripInfo.startDate.slice(8, 10));
      console.log(this.subscripInfo);
    });
  }

  ngOnInit() {

  }


  onBack() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
    } else {
      this.ngLocation.back();
    }
  }
}
