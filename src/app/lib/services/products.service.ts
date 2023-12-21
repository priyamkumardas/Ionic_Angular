import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CommonApi } from './api/common.api';
import { CommonService } from './common.service';
import { environment } from 'src/environments/environment';
import { ApiUrls, Constants } from 'src/app/config/constants';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  selectedCategories = []; //Array consists of all the categories selected by users
  partnerCatalog = [];

  constructor(
    private commonApi: CommonApi,
    private commonService: CommonService,
    private storageService: StorageService
  ) {}

  homegetProductsList(url) {
    return forkJoin({
      productsData: this.commonApi.getCDNLink(url.productsData),
      categoryData: this.commonApi.getCDNLink(url.categoryData),
      microCategoryData: this.commonApi.getCDNLink(url.microCategoryData),
    }).pipe(
      catchError((err) => this.errorHandler(err)),
      map(({ productsData, categoryData, microCategoryData }) => ({
        productsData,
        categoryData,
        microCategoryData,
      }))
    );
  }


  // Changed master catalog data array new service function
  homegetProductsListNew(url) {
  console.log(url);
  // return this.commonApi.getCDNLink(url.masterCatalogData);
  // masterCatalogData: this.commonApi.getCDNLink("https://uat-static.sarvm.ai/matereCatalog_20.json")
  return forkJoin({
    masterCatalogData: this.commonApi.getCDNLink(url.masterCatalogData)
  }).pipe(
    catchError((err) => this.errorHandler(err)),
    map(({ masterCatalogData }) => ({
      masterCatalogData,
    }))
    
  );
  
  }

  getmerchantListArray(category) {
    //const url = `http://43.205.9.141:1205/apis/v1/households/stores?limit=10&offset=10&category=${category}`;
    const url = `${
      environment.baseUrl + ApiUrls.catalog.stores
    }?limit=10&offset=2&category=${category}`;
    return this.commonApi.getDataByUrl(url);
  }

  getSplashApi() {
    const url = environment.baseUrl + ApiUrls.splash;
    return this.commonApi.getDataByUrl(url);
  }

  getcatogoriesList() {
    //const url = 'http://43.205.9.141:1205/apis/v1/households/splash';
    const url = `${environment.baseUrl + ApiUrls.splash}`;
    return this.commonApi.getDataByUrl(url);
  }

  getCatalogList() {
    const storeId =
      this.commonService.getUserData() &&
      this.commonService.getUserData().shopId
        ? this.commonService.getUserData().shopId
        : this.storageService.getItem(Constants.SHOP_ID)
        ? this.storageService.getItem(Constants.SHOP_ID)
        : this.commonService.getUserData().userId;
    const url = `${environment.baseUrl + ApiUrls.catalog.retailerCatalog + storeId}`;    
    return this.commonApi.getDataByUrl(url).pipe(catchError((err) => this.errorHandler(err)));
  }

  updateCatalogData(data) {
    //const url = 'http://43.205.9.141:1205/apis/v1/households/splash';
    const storeId =
      this.commonService.getUserData() &&
      this.commonService.getUserData().shopId
        ? this.commonService.getUserData().shopId
        : this.storageService.getItem(Constants.SHOP_ID)
        ? this.storageService.getItem(Constants.SHOP_ID)
        : this.commonService.getUserData().userId;
    // const url = `${ApiUrls.retailerCatalog}${storeId}`;
    const url = `${'/rms/apis/v2/catalog/'}${storeId}`;
    // console.log(url);
    
    return this.commonApi.putData(url, data).pipe(catchError((err) => this.errorHandler(err)));
  }

  addCatalogData(data) {
    //const url = 'http://43.205.9.141:1205/apis/v1/households/splash';
    const storeId =
      this.commonService.getUserData() &&
      this.commonService.getUserData().shopId
        ? this.commonService.getUserData().shopId
        : this.storageService.getItem(Constants.SHOP_ID)
        ? this.storageService.getItem(Constants.SHOP_ID)
        : this.commonService.getUserData().userId;
    const url = `${ApiUrls.catalog.retailerCatalog}${storeId}`;
    const productData = {
      products: data,
    };
    return this.commonApi.postData(url, productData);
  }
  private errorHandler(err) {
    this.commonService.danger(err.error.error.message);
    return throwError(err);
  }
}