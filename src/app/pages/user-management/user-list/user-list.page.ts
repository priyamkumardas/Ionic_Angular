import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/lib/services/order.service';
import { CommonService } from 'src/app/lib/services/common.service';
import { UserService } from 'src/app/lib/services/user.service';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Constants } from 'src/app/config/constants';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {
  associated: any;

  constructor(
    public commonService: CommonService,
    private orderService: OrderService,
    private userService: UserService,
    private storageService: StorageService
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getDeliveryBoyList()
  }

  async ionViewWillLeave() {
    this.commonService.dismissToast()
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe(res => {
      console.log(res);
    })
  }

  async getDeliveryBoyList() {
    let shopId = this.storageService.getItem(Constants.SHOP_ID) ? this.storageService.getItem(Constants.SHOP_ID) : this.commonService.userData.shopId
    const presentLoader = await this.commonService.presentLoader();
    presentLoader.present();
    try {
      const res = await this.orderService.getUserCreatedDeliveryBoyList(shopId).toPromise();
      this.associated = res['data'];
    } catch (err) {
      console.log(err);
    } finally {
      presentLoader.dismiss();
    }
  }
}
