import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/lib/services/common.service';
import { StorageService } from 'src/app/lib/services/storage.service';
import { UserService } from 'src/app/lib/services/user.service';
import { Constants } from 'src/app/config/constants';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  userData: any;

  constructor(
    public commonService: CommonService,
    private userService: UserService,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.userData = this.commonService.userData;
  }

  deleteAccount() {
    this.commonService.customAlert('Are you sure', 'You want to delete your account?', () => { this.delete() }, () => { });
  }

  async delete() {
    
    let userId = this.userData?.userId
    this.userService.deleteAccount(userId).subscribe(res => {
      
      localStorage.clear();
      this.storageService.removeItemNativeCatalog(Constants.SELECTED_CATEGORIES)
      this.router.navigate(['/login'])
    },err=>{
      console.log(err)
      this.commonService.danger(err.error?.error?.error?.message)
    })
  }
}
