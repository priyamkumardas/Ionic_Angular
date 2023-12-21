import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Constants } from '../../config/constants';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public storage: StorageService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentRoute = next.routeConfig.path;
    const token = this.storage.getItem(Constants.AUTH_TOKEN) ? true : false;
    console.log('token',token)
    if (token && currentRoute === 'login') {
      this.router.navigate(['/home']);
    } else if (!token && currentRoute === 'login') {
      return true;
    } else if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
