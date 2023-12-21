import { CommonService } from './../../../lib/services/common.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Constants } from 'src/app/config/constants';
import { LocationService } from 'src/app/lib/services/location.service';
import { OnboardService } from 'src/app/lib/services/onboard.service';
import { ModalController, NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { KycFormPage } from '../../kyc/kyc-form/kyc-form.page';
import { Capacitor } from '@capacitor/core';
@Component({
  selector: 'app-shop-address',
  templateUrl: './shop-address.page.html',
  styleUrls: ['./shop-address.page.scss'],
})
export class ShopAddressPage implements OnInit {
  shopAddressForm: FormGroup;
  isSubmitted = false;
  userLatLon: any;
  userData: any;
  shopId: string;
  shopExist: boolean;
  searchAddResult: any = [];
  searchText: string;
  getcurrentLocation = false;

  location: any = {
    lat: 20.5937,
    lng: 78.9629,
  };
  changedLocation: any = {
    lat: null,
    lng: null
  };

  address: any = [];
  sellingType: any = '';
  shopDetails: any;

  form = {
    addressType: 'Other',
    primary: false,
    streetAddress: null,
    locality: null,
    landmark: null,
    city: null,
    state: null,
    country: 'India',
    pincode: null,
    location: {
      longitude: null,
      latitude: null,
    }
  };

  country: any;
  stateList = [
    {
      "key": "AN",
      "name": "Andaman and Nicobar Islands"
    },
    {
      "key": "AP",
      "name": "Andhra Pradesh"
    },
    {
      "key": "AR",
      "name": "Arunachal Pradesh"
    },
    {
      "key": "AS",
      "name": "Assam"
    },
    {
      "key": "BR",
      "name": "Bihar"
    },
    {
      "key": "CG",
      "name": "Chandigarh"
    },
    {
      "key": "CH",
      "name": "Chhattisgarh"
    },
    {
      "key": "DH",
      "name": "Dadra and Nagar Haveli"
    },
    {
      "key": "DD",
      "name": "Daman and Diu"
    },
    {
      "key": "DL",
      "name": "Delhi"
    },
    {
      "key": "GA",
      "name": "Goa"
    },
    {
      "key": "GJ",
      "name": "Gujarat"
    },
    {
      "key": "HR",
      "name": "Haryana"
    },
    {
      "key": "HP",
      "name": "Himachal Pradesh"
    },
    {
      "key": "JK",
      "name": "Jammu and Kashmir"
    },
    {
      "key": "JH",
      "name": "Jharkhand"
    },
    {
      "key": "KA",
      "name": "Karnataka"
    },
    {
      "key": "KL",
      "name": "Kerala"
    },
    {
      "key": "LD",
      "name": "Lakshadweep"
    },
    {
      "key": "MP",
      "name": "Madhya Pradesh"
    },
    {
      "key": "MH",
      "name": "Maharashtra"
    },
    {
      "key": "MN",
      "name": "Manipur"
    },
    {
      "key": "ML",
      "name": "Meghalaya"
    },
    {
      "key": "MZ",
      "name": "Mizoram"
    },
    {
      "key": "NL",
      "name": "Nagaland"
    },
    {
      "key": "OR",
      "name": "Odisha"
    },
    {
      "key": "PY",
      "name": "Puducherry"
    },
    {
      "key": "PB",
      "name": "Punjab"
    },
    {
      "key": "RJ",
      "name": "Rajasthan"
    },
    {
      "key": "SK",
      "name": "Sikkim"
    },
    {
      "key": "TN",
      "name": "Tamil Nadu"
    },
    {
      "key": "TS",
      "name": "Telangana"
    },
    {
      "key": "TR",
      "name": "Tripura"
    },
    {
      "key": "UK",
      "name": "Uttar Pradesh"
    },
    {
      "key": "UP",
      "name": "Uttarakhand"
    },
    {
      "key": "WB",
      "name": "West Bengal"
    }
  ];
  helpVideo: any;

  constructor(
    private router: Router,
    private ngLocation: Location,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    public commonService: CommonService,
    private storageService: StorageService,
    private onboardService: OnboardService,
    private locationService: LocationService,
    private modalCtrl: ModalController,
  ) {

  }

  ngOnInit() {
    this.shopAddressForm = this.formBuilder.group({
      shop_name: ['', [Validators.required]],
      shop_number: ['', [Validators.required]],
      locality: [''],
      street: [''],
      landmark: [''],
      city: ['', [Validators.required]],
      state: [''],
      pincode: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('[0-9]{6}'),
        ]),
      ],
    });
    this.country = 'India';
    this.shopId =
      this.commonService.getUserData() &&
        this.commonService.getUserData().shopId
        ? this.commonService.getUserData().shopId
        : this.storageService.getItem(Constants.SHOP_ID);
  }

  omitSpecialChar(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }
  
  ionViewWillEnter() {
    this.route.params.subscribe((res) => {
      if (
        res['sellingType'] != '' &&
        res['sellingType'] != null &&
        res['sellingType'] != undefined
      ) {
        this.sellingType = res['sellingType'];
      } else {
        this.sellingType = this.storageService.getItem(Constants.SELLING_TYPE);
      }
    });
    this.shopId =
      this.commonService.getUserData() &&
        this.commonService.getUserData().shopId
        ? this.commonService.getUserData().shopId
        : this.storageService.getItem(Constants.SHOP_ID);
    if (this.commonService.getUserData().shopId === null) {
      this.shopExist = false;
      // if shop
      this.getLocationService();
    } else {
      this.shopExist = true;
      this.getShopDetailsSubscription();
    }
    console.log(this.shopExist)
  }

  getLocationService() {
    this.locationService.getUserLocation().then((res: any) => {
      if (res) {
        this.userLatLon = { latitude: res?.lat, longitude: res?.lng };
        this.location = { lat: res?.lat, lng: res?.lng };
        this.getAddress(this.location);
      }
    });
  }
  getShopDetailsSubscription() {
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.onboardService.getShopDetails(this.shopId ? this.shopId : null).subscribe((shopDetails: any) => {
        loading.dismiss()
        this.shopDetails = shopDetails;
        this.shopAddressForm.controls['shop_name'].setValue(shopDetails.data[0].shop_name);
        this.shopAddressForm.controls['shop_number'].setValue(shopDetails.data[0].shop_number);
        this.shopAddressForm.controls['locality'].setValue(shopDetails.data[0].locality);
        this.shopAddressForm.controls['street'].setValue(shopDetails.data[0].street);
        this.shopAddressForm.controls['landmark'].setValue(shopDetails.data[0].landmark);
        this.shopAddressForm.controls['city'].setValue(shopDetails.data[0].city);
        this.shopAddressForm.controls['state'].setValue(shopDetails.data[0].state);
        this.shopAddressForm.controls['pincode'].setValue(shopDetails.data[0].pincode);
        this.sellingType = (shopDetails.data[0].selling_type ? shopDetails.data[0].selling_type : '');
        this.location = {};
        this.location.lat = shopDetails.data[0].latitude;
        this.location.lng = shopDetails.data[0].longitude;
        console.log('this.location', this.location)
      }, error => {
        loading.dismiss()
        console.log(error)
      });
    })
  }

  get errorControl() {
    return this.shopAddressForm.controls;
  }

  searchAddress(data) {
    console.log(data.target.value)
    this.locationService.getSearchLocation(data.target.value).subscribe((data) => {
      console.log(data);
      this.searchAddResult = data;
    });
  }

  searchCity(cityName) {
    this.searchText = ''
    let cityLat = parseFloat(cityName.lat)
    let cityLon = parseFloat(cityName.lon)
    this.location = {
      lat: cityLat,
      lng: cityLon
    };
    console.log(this.location);
    this.getAddress(this.location)
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.shopAddressForm.valid) {
      this.commonService.danger('Please input all required fields!');
      return false;
    } else {
      if (this.location.lat != 0 && this.location.lng) {
        const userData = {
          latitude: this.location?.lat,
          longitude: this.location?.lng,
          selling_type: this.sellingType,
        };
        const formDataObject = Object.assign(this.shopAddressForm.value, userData);
        this.commonService.presentLoader().then(loading => {
          loading.present()
          this.onboardService.addNewShopDetails(formDataObject, this.shopId ? this.shopId : null).subscribe((res: any) => {
            loading.dismiss()
            // we need to add if shop not exists
            if (!this.shopExist) {
              this.storageService.setItem(Constants.SHOP_ID, res?.data?.shop_id);
              this.storageService.setItem(Constants.AUTH_TOKEN, res.data.accessToken);
              this.storageService.setItem(Constants.SHOP_NAME, this.commonService.parseJwt(res.data.accessToken).shopMeta?.shop?.shop_name);
              this.storageService.setItem(Constants.PROFILE_URL, res?.data?.profileUrl);
              console.log(this.storageService.getItem(Constants.SHOP_NAME), 'SHOPNAME')
              this.onboardService.shopAdded = true;
            }
            this.commonService.setUserData();
            this.storageService.setItem(Constants.SHOP_ADDRESS, formDataObject);
            if (this.shopExist) {
              this.ngLocation.back();
              this.storageService.setItem(Constants.SHOP_NAME, res?.data[0]?.shop_name);
            } else {
              //this.router.navigate(['home']);
              this.openKYCModal();
            }
          }, (error) => {
             loading.dismiss()
             error.error?.error?.code == 'SHOP_ALREADY_EXIST' ? this.shopExistErrorHandling(error) : this.commonService.danger(error.error?.error?.message);
            // this.commonService.closeProgressBarLoading();
          });
        })
      } else {
        this.commonService.danger('Please input valid location!');
      }
    }
  }

  shopExistErrorHandling(error){
    this.commonService.toast(error.error?.error?.message);
    this.router.navigate(['home']);
  }

  getLocation(location?) {
    //Native Platform check
    this.commonService.presentProgressBarLoading();
    if (Capacitor.isNativePlatform()) {
      this.locationService.getAcurateLocation().then(res => {
        this.locationService.getLocation().then(res => {
          this.commonService.closeProgressBarLoading();
          this.commonService.hasCurrentLocation = false;
          this.location = {
            lat: location ? location.latitude : res.coords.latitude,
            lng: location ? location.longitude : res.coords.longitude
          }
          this.getAddress(this.location)
        }).catch(err => {
          this.commonService.closeProgressBarLoading();
          this.commonService.alert('Location permission', 'Location is needed for the app to work properly, kindly go to settings and provide location permission to app.', 'Ok', 'Cancel', () => this.getLocation(), () => { });
        })
      }).catch(err => {
        this.commonService.closeProgressBarLoading();
        this.commonService.alert('Location permission', 'Location is needed for the app to work properly, kindly go to settings and provide location permission to app.', 'Ok', 'Cancel', () => this.getLocation(), () => { });
      });
    } else {
      //map load for the local (browser)
      this.locationService.getLocation().then(res => {
        this.commonService.closeProgressBarLoading();
        this.commonService.hasCurrentLocation = false;
        console.log(res, 'res')
        this.location = {
          lat: location ? location.latitude : res.coords.latitude,
          lng: location ? location.longitude : res.coords.longitude
        }
        this.getAddress(this.location)
      }).catch(err => {
        this.commonService.closeProgressBarLoading();
        this.commonService.alert('Location permission', 'Location is needed for the app to work properly, kindly go to settings and provide location permission to app.', 'Ok', 'Cancel', () => this.getLocation(), () => { });
      })
    }
  }

  getAddress(e) {
    console.log(e)
    this.changedLocation = {
      lat: e.lat,
      lon: e.lon ? e.lon : e.lng
    }
    if (e.lat && (e.lon || e.lng)) {
      this.location.lat = e.lat;
      this.location.lng = e.lon ? e.lon : e.lng;
    }
    this.commonService.presentProgressBarLoading();
    this.locationService.getAddressFormLatlong(e.lat, e.lon ? e.lon : e.lng).subscribe((data) => {
      this.commonService.closeProgressBarLoading();
      console.log(data['results'][0])
      this.commonService.hasCurrentLocation = true;
      this.address = {
        address: {
          city: data['results'][0].address_components[data['results'][0].address_components.length - 5].long_name,
          state: data['results'][0].address_components[data['results'][0].address_components.length - 3].long_name,
          postcode: data['results'][0].address_components[data['results'][0].address_components.length - 1].long_name,
          locality: data['results'][0].address_components[1].long_name,
          street: data['results'][0].address_components[data['results'][0]?.address_components.length - 5]?.long_name,
          landmark: data['results'][0].address_components[data['results'][0]?.address_components.length - 7]?.long_name
        },
        display_name: data['results'][0].formatted_address,
        lat: e.lat,
        lon: e.lon
      }
      this.shopAddressForm.patchValue({
        street: this.address.address.street,
        locality: this.address.address.locality,
        landmark: this.form.landmark ? this.form.landmark : '',
        city: this.address.address.city,
        state: this.address.address.state,
        country: 'India',
        postcode: this.address.address.postcode,
        location: {
          longitude: this.address.lat?.toString(),
          latitude: this.address.lng?.toString() ? this.address.lng?.toString() : this.address.lon?.toString(),
        }
      });
      //auto clicking on input when address get's update to force update the address in inputs
      // document.getElementById('clickButton').click();
      this.autoClickfunction()
    }, (error) => {
      console.log(error);
      this.commonService.closeProgressBarLoading();
    }
    );
  }

  autoClickfunction() {
    document.getElementById('clickButton').click();
  }

  // getPostalCode() {
  //   if(this.address?.address?.postcode != this.shopAddressForm.get('pincode')?.value){
  //     let postal = new String(this.shopAddressForm.get('pincode').value) 
  //     if(this.shopAddressForm.get('pincode').value != undefined && this.shopAddressForm.get('pincode').value != null && this.shopAddressForm.get('pincode').value != ""  && postal.length === 6){
  //       let data = e?.detail?.value ? JSON.parse(e.detail.value) : e;
  //       this.commonService.presentProgressBarLoading();
  //       this.locationService.getFormPostalCode(data,this.country).subscribe((data: any) => {
  //         this.commonService.closeProgressBarLoading();
  //         console.log(data);
  //         this.location = {};
  //         this.location.lat = JSON.parse(data[0].lat);
  //         this.location.lng = JSON.parse(data[0].lon);
  //         this.shopAddressForm.controls['state'].setValue(data[0]?.address?.state);
  //         this.shopAddressForm.controls['region'].setValue(data[0]?.address?.county);
  //       },(error) => {
  //         console.log(error);
  //         this.commonService.closeProgressBarLoading();
  //       });
  //     }
  //   }
  // }

  getPostalCode(event) {
    console.log(event.target.value.length)
    //this.shopAddressForm.get('pincode').value.length
   
    if (event.target.value.length == 6) {
      this.commonService.presentProgressBarLoading();
      this.locationService.getFormPostalCode(event.target.value, this.country).subscribe(res => {
        this.commonService.closeProgressBarLoading();
        console.log(res);
        this.location = {
          lat: (res['results'][0].geometry.location.lat),
          lng: (res['results'][0].geometry.location.lng),
        }
      }, error => {
        this.commonService.closeProgressBarLoading();
      })
    }
  }

  async openKYCModal() {
    const model = await this.modalCtrl.create({
      component: KycFormPage,
      cssClass: 'bottomModal',
      componentProps: {
        isModal: true,
      },
    });
    await model.present();
  }

  onBack() {
    this.ngLocation.back();
  }

  onKeyPress(event) {
    if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122) || event.keyCode === 32 || event.keyCode === 46 ) {
      return true;
    } else {
      return false;
    }
  }

  async openHelpVideo() {
    this.helpVideo = this.storageService.getItem(Constants.HELP_VIDEOS);
    this.commonService.openHelpVideo(this.helpVideo.Onboarding)
   }
}
