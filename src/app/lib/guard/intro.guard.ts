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
export class IntroGuard implements CanActivate {
  constructor(public storage: StorageService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const intro = localStorage.getItem(Constants.SELECT_LANGUAGES);
    if (intro) {
      return true;
    } else {
      this.router.navigate(['selected-language']);
      return false;
    }
  }
}
