import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class GenericApi {
  constructor(private http: HttpClient) {}
  /**
   * @method get
   * @description Hit http request and get object Observable.
   * @returns An `Observable` of the Object.
   */
  protected get(url: string, options?: any): Observable<object> {
    return this.http.get(url, options);
  }
  /**
   * @method post
   * @description Hit http request and get object Observable.
   * @returns An `Observable` of the Object.
   */
  protected post(url: string, body: any, options?: any): Observable<object> {
    return this.http.post(url, body, options);
  }
  /**
   * @method post
   * @description Hit http request and get object Observable.
   * @returns An `Observable` of the Object.
   */
  protected put(url: string, body: any): Observable<object> {
    return this.http.put(url, body, {});
  }
  /**
   * @method delete
   * @description Hit http request and get object Observable.
   * @returns An `Observable` of the Object.
   */
  protected delete(url: string, body?: any): Observable<object> {
    const options = {
      params: {},
      body,
    };
    return this.http.delete(url, options);
  }
}
