import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';
import { Constants } from 'src/app/config/constants';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService {
  constructor(private storageservice: StorageService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = this.storageservice.getItem(Constants.AUTH_TOKEN)
      ? this.storageservice.getItem(Constants.AUTH_TOKEN)
      : environment.unauthToken;

    if (token && !request.headers.get('skip')) {
      request = request.clone({
        headers: request.headers
          .set('Authorization', 'Bearer ' + token)
          .set('app_name', environment.app_name)
          .set('app_version_code', environment.app_version_code),
      });
    } else {
      if (request.headers.get('skip')) {
        request = request.clone({
          headers: request.headers.delete('skip'),
        });
      }
    }

    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err.status === 0 || err.status === 503) {
          //this.router.navigateByUrl(`/maintenance`);
        }
        return throwError(err);
      })
    );
    //} else {
    //  return Observable.throw(new HttpErrorResponse({ status: 4 }));
    //}
  }
}
