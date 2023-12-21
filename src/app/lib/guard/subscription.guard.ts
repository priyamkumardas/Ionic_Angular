import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Constants } from '../../config/constants';
import { StorageService } from '../services/storage.service';
import { CommonService } from "../services/common.service";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionGuard implements CanActivate {

  constructor(
    public storage: StorageService,
    public router: Router,
    public commonService: CommonService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const checkUserSubscription = this.storage.getItem(Constants.ACTIVE_SUBSCRIPTION_FLAG);
    console.log(checkUserSubscription);
    if (checkUserSubscription) {
      this.router.navigate(['/subscription'])
      return false;
    } else {
      return true;
    }
  };

}
