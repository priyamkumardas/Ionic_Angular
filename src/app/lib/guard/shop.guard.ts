import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';

import { Constants } from '../../config/constants';
import { StorageService } from '../services/storage.service';
import { CommonService } from "../services/common.service";
import { OnboardService } from "../services/onboard.service";
import { AuthGuard } from "../guard/auth.guard";

@Injectable({
  providedIn: 'root'
})
export class ShopGuard implements CanActivate {
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  constructor(
    public storage: StorageService,
    public router: Router,
    public commonService: CommonService,
    public onboardingservice: OnboardService,
    public authguard: AuthGuard
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const userData = this.commonService.getUserData();
    console.log('userdata', userData)
    const currentRoute = next.routeConfig.path;


    //   if(currentRoute=='shop-address'){
    //     if(this.onboardingservice.shopAdded){
    //       this.router.navigate(['home']);
    //       return false
    //     }else{
    //       return true;
    //     }
    //   }else{
    //     console.log('userdata shop guard', userData)
    //     if(userData){
    //       if (userData.shopId!=null) {
    //         return true;
    //       } else {
    //         this.router.navigate(['shop-address', {"sellingType":"fixed"}]);
    //         return false;
    //       }
    //     }else{
    //       // this.router.navigate(['shop-address', {"sellingType":"fixed"}]);
    //       //this.authguard.canActivate()
    //       return false;
    //     }

    //   }

    // }
    if (userData) {
      if (userData.shopId == null) {
        //this.router.navigate(['shop-address', {"sellingType":"fixed"}]);
        this.router.navigate(['selling-mode']);
        this.commonService.toast('Please create a Shop in order to proceed.')
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  //   if(userData){
  //         if (userData.shopId==null) {
  //           this.router.navigate(['shop-address', {"sellingType":"fixed"}]);
  //           this.commonService.toast('Please create a Shop in order to proceed.')
  //           return false;
  //         } else {
  //           return true;
  //         }
  //       }else{
  //         return true;
  //       }
  // }
}
