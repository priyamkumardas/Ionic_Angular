import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Constants } from 'src/app/config/constants';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Location } from '@angular/common';
import { ShopAddressPage } from '../shop-address/shop-address.page';
import { CommonService } from 'src/app/lib/services/common.service';

@Component({
  selector: 'app-selling-mode',
  templateUrl: './selling-mode.page.html',
  styleUrls: ['./selling-mode.page.scss'],
})
export class SellingModePage implements OnInit {


  constructor(private router: Router,
    private ngLocation: Location,
    private modalCtrl: ModalController,  private commonService: CommonService,
    private storageService: StorageService) { 
    }

  ngOnInit() {
  }

  selectType(type){
    this.storageService.setItem(Constants.SELLING_TYPE,type);
    //this.router.navigate(['/shop-address']);
      this.router.navigate(['shop-address', {"sellingType":type}]);

  }

  /*
  onBack(){
    this.ngLocation.back();
  }
  */
}
