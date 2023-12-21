import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { Location } from '@angular/common';
import { OnboardService } from 'src/app/lib/services/onboard.service';
import { PhotoService } from 'src/app/lib/services/photo.service';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Constants } from 'src/app/config/constants';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { PackageListPage } from '../../payment/package-list/package-list.page';

import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@awesome-cordova-plugins/file-transfer/ngx';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { CommonService } from 'src/app/lib/services/common.service';
import { GstComponent } from '../gst/gst.component';

@Component({
  selector: 'app-kyc-form',
  templateUrl: './kyc-form.page.html',
  styleUrls: ['./kyc-form.page.scss'],
})
export class KycFormPage implements OnInit {
  kycForm: FormGroup;
  isSubmitted = false;
  defaultDate;
  format = 'YYYY-MM-DD';
  aadharKYCURLs: any;
  panKYCURLs: any;
  aadharDocIsUpload = false;
  panDocIsUpload = false;
  segment = 'addressDetail';
  adharImage = '';
  documentkey = ''
  panCardImage = ''
  panImage = '';
  dateCondition = {
    max: '',
    min: ''
  };
  kycUserInfo: any = [];
  today;
  helpVideo: any;

  get errorControl() {
    return this.kycForm.controls;
  }
  updateOrAdd: boolean = false;
  shopId: string;
  @Input() isModal: boolean;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private camera: Camera,
    private ngLocation: Location,
    private route: ActivatedRoute,
    private transfer: FileTransfer,
    private navCtrl: NavController,
    private photoService: PhotoService,
    public commonService: CommonService,
    private onboardService: OnboardService,
    private storageService: StorageService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform
  ) {
    this.shopId = this.commonService.getUserData() && this.commonService.getUserData().shopId
    ? this.commonService.getUserData().shopId : this.storageService.getItem(Constants.SHOP_ID);

    // this.platform.backButton.subscribeWithPriority(10, () => {
    //   console.log('Handler was called!');
    //   if (this.isModal) {
    //     this.confirmback()
    //   } else {
    //     this.navCtrl.pop();
    //   }
    // });
  }

  ngOnInit() {
    console.log(this.isModal)
    if (!this.isModal) {
      this.getKYCDetails();
    }
    this.kycForm = this.formBuilder.group({
      idno: ['', [Validators.required]],
      name: ['', [Validators.required]],
      shopNumber: ['', [Validators.required]],
      area: ['', [Validators.required]],
      street: ['', [Validators.required]],
      landmark: [''],
      city: ['', [Validators.required]],
      pincode: ['', [Validators.required]],

      panno: [''],
      panName: [''],
      fathername: [''],
      dob: [''],
    });
    this.today = this.getCurrentDate();
    this.dateCondition.max = this.today;

  }
  getCurrentDate(format: string = 'YYYY-MM-DD') {
    return moment().format(this.format);
  }

  async openHelpVideo() {
    this.helpVideo = this.storageService.getItem(Constants.HELP_VIDEOS);
    this.commonService.openHelpVideo(this.helpVideo.Onboarding)
   }

  getDate(e) {
    this.kycForm.get('dob').setValue(moment(e.value).format('YYYY-MM-DD'), {
      onlyself: true,
    });
  }

  getKYCDetails() {
    this.commonService.present();
    this.onboardService.getKYCDetail().subscribe((res: any) => {
      console.log('kycres', res);
      this.commonService.dismiss();
      this.kycForm.controls['idno'].setValue(res.data[0]?.idno);
      this.kycForm.controls['name'].setValue(res.data[0]?.name);
      this.kycForm.controls['shopNumber'].setValue(res?.data[0]?.shopNumber);
      this.kycForm.controls['area'].setValue(res.data[0]?.area);
      this.kycForm.controls['street'].setValue(res.data[0]?.street);
      this.kycForm.controls['landmark'].setValue(res.data[0]?.landmark);
      this.kycForm.controls['city'].setValue(res.data[0]?.city);
      this.kycForm.controls['pincode'].setValue(res.data[0]?.pincode);
      this.kycForm.controls['panno'].setValue(res.data[0]?.panno);
      this.kycForm.controls['panName'].setValue(res.data[0]?.panName);
      this.kycForm.controls['fathername'].setValue(res.data[0]?.fathername);
      this.kycForm.controls['dob'].setValue(res.data[0]?.dob);
      if (res.data[0]?.aadhar_key !== null) {
        this.aadharDocIsUpload = true;
        this.adharImage = res.data[0]?.aadhar_key;
        this.documentkey = res.data[0]?.aadhar_key
        //this.aadharKYCURLs.key = res.data[0].aadhar_key;
      }
      if (res.data[0]?.pan_key !== null) {
        this.panDocIsUpload = true;
        this.panImage = res.data[0]?.pan_key;
        this.panCardImage = res.data[0]?.pan_key
        //this.panKYCURLs.key = res.data[0].pan_key;
      }
      if ((res?.success && res?.data?.length != 0) && (res?.data[0]?.shop_id != null && res?.data[0]?.shop_id != undefined)) {
        this.updateOrAdd = true;
        this.kycUserInfo = res?.data[0];
        res.data[0].fathername == null ? res.data[0].fathername = '' : res.data[0].fathername;
        res.data[0].panno == null ? res.data[0].panno = '' : res.data[0].panno;
        res.data[0].pan_key == null ? res.data[0].pan_key = '' : res.data[0].pan_key;
        this.kycUserInfo.dob = moment(res?.data[0].dob).format('YYYY-MM-DD');
        this.defaultDate = this.kycUserInfo.dob;
      } else {
        this.updateOrAdd = false;
      }
    }, (error) => {
      this.commonService.dismiss();
      this.commonService.danger(error);
    });
  }

  dateValid(input) {
    return moment(input).format('YYYY-MM-DD');
  }

  chooseImage(uploadId: string) {
    this.onboardService.getUploadKYCURL(uploadId).subscribe((verifidDoc: any) => {
      if (verifidDoc?.success) {
        console.log(verifidDoc);
        if (verifidDoc?.data && verifidDoc.data.key && verifidDoc?.data?.url) {
          if (uploadId === 'aadhar') {
            this.aadharKYCURLs = verifidDoc.data;
            this.selectImage(uploadId);
          } else {
            this.panKYCURLs = verifidDoc.data;
            this.selectImage(uploadId);
          }
        } else {
          this.commonService.danger("some data are not valid!");
          return;
        }
      }
    }, (err) => {
      console.log(err);
      this.commonService.danger(JSON.stringify(err));
    });
  }

  submitfinal() {
    !this.isModal ? this.updateKYCDetails() : this.submitForm();
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.kycForm.valid) {
      this.commonService.danger('Please provide all the required values!');
      return false;
    } else {
      if (this.aadharDocIsUpload) {
        let documentKeys;
        documentKeys = Object.assign(this.kycForm.value, { "aadhar_key": this.aadharKYCURLs?.key })
        if (this.panDocIsUpload) {
          documentKeys = Object.assign(documentKeys, { "pan_key": this.panKYCURLs?.key ? this.panKYCURLs?.key : "" });
        }
        let kycData = Object.assign(documentKeys, { "shop_id": this.storageService.getItem(Constants.SHOP_ID) + "" })

        this.commonService.present();
        this.onboardService.addKYCFormDetals(kycData).subscribe((res: any) => {
          if (res?.success) {
            this.commonService.dismiss();
            this.storageService.setItem(Constants.KYC_DETAILS, {
              kyc: this.kycForm.value,
            });
            if (!this.isModal) {
              this.ngLocation.back();
            } else {
              this.confirmGStNumber()
            }
          }
        }, (error) => {
          this.commonService.dismiss();
          console.log(error);
        });
      } else {
        this.aadharDocIsUpload = false;
        this.commonService.danger('Please Upload A Document');
      }
    }
  }

  updateKYCDetails() {
     this.isSubmitted = true;
    if (!this.kycForm.valid) {
      this.commonService.danger('Please provide all the required values!');
      return false;
    } else {
      if (this.aadharDocIsUpload) {
        let documentKeys;
        documentKeys = Object.assign(this.kycForm.value, { "aadhar_key": (this.aadharKYCURLs?.key ? this.aadharKYCURLs?.key : this.documentkey) })
        if (this.panDocIsUpload) {
          documentKeys = Object.assign(documentKeys, { "pan_key": (this.panKYCURLs?.key ? this.panKYCURLs?.key : "") ? (this.panKYCURLs?.key ? this.panKYCURLs?.key : "") : this.panCardImage });
        }
        let kycData = Object.assign(documentKeys, { "shop_id": this.storageService.getItem(Constants.SHOP_ID) + "" })
        this.commonService.present();
        kycData == null || kycData == undefined ? kycData = '' : kycData
        console.log(kycData, 'kycData')
        this.onboardService.addKYCFormDetals(kycData).subscribe((res: any) => {
          if (res?.success) {
            this.commonService.dismiss();
            this.router.navigate(['/profile']);
          }
        }, (error) => {
          this.commonService.dismiss();
          console.log(error);
        });
      } else {
        this.aadharDocIsUpload = false;
        this.commonService.danger('Please Upload A Document');
      }
    }
  }

  skipView() {
    this.router.navigate(['/bank-form']);
  }

  onBack() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
    } else if (this.isModal === undefined) {
      this.router.navigate(['/profile']);
    } else {
      this.ngLocation.back();
    }
  }

  segmentChanged(e) {
    this.segment = e.detail.value;
  }

  async openGstModal() {
    this.modalCtrl.dismiss()
    const modal = await this.modalCtrl.create({
      component: GstComponent,
      cssClass: 'gst-modal-css',
      componentProps: {
        isModal: true,
      }
    });
    await modal.present();
  };

  async openPackageListPageModal() {
    this.modalCtrl.dismiss()
    const model = await this.modalCtrl.create({
      component: PackageListPage,
      cssClass: 'bottomModal',
      componentProps: {
        isModal: true,
      },
    });
    await model.present();
  }

  async confirmGStNumber() {
    const alert = await this.alertCtrl.create({
      header: 'Do You Have GSTIN Number?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            this.openPackageListPageModal()
          },
        },
        {
          text: 'YES',
          role: 'confirm',
          handler: () => {
            this.openGstModal()
          },
        },
      ],
    });
    await alert.present();
  };

  async selectImage(uploadId: any,) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load From Gallery',
        handler: () => {
          this.uploadResource(uploadId, this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.uploadResource(uploadId, this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  onKeyPress(event) {
    if ((event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 97 && event.keyCode <= 122) || event.keyCode === 32 || event.keyCode === 46) {
      return true;
    }
    else {
      return false;
    }
  }

  restrictSpecialCharacters(event) {
    if ((event.keyCode > 64 && event.keyCode < 91) || (event.keyCode > 96 && event.keyCode < 123) || event.keyCode == 8 || event.keyCode == 32 || (event.keyCode >= 48 && event.keyCode <= 57)) {
      return true;
    }
    else {
      return false;
    }
  }

  ConfirmKYCSkip() {
    if (this.isModal) {
      this.modalCtrl.dismiss();
      this.openGstModal();
    } else {
      this.ngLocation.back();
    }
  }


  omit_special_char(event) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  uploadResource(uploadId: any, typeAction: any) {
    this.photoService.takePhoto(typeAction).then((res) => {
      if (res?.success) {
        //console.log("res==>", res.mediaPath);
        const fileNm = res.mediaPath;
        const fileTransfer: FileTransferObject = this.transfer.create();
        if (uploadId !== 'aadhar') {
          this.panImage = fileNm.replace(/file:\/\//gi, "http://localhost/_capacitor_file_");
        } else {
          this.adharImage = fileNm.replace(/file:\/\//gi, "http://localhost/_capacitor_file_");
        }
        const options: FileUploadOptions = {
          fileKey: 'file',
          fileName: fileNm.substring(fileNm.lastIndexOf('/') + 1),
          headers: { 'Content-Type': 'image/jpg' },
          chunkedMode: false,
          httpMethod: 'PUT',
          mimeType: 'image/jpg',
        };

        if (uploadId === 'aadhar') {
          fileTransfer.upload(fileNm, this.aadharKYCURLs.url, options).then((data) => {
            if (data.responseCode == 200) {
              this.aadharDocIsUpload = true;
              //console.log(data + " Uploaded Successfully");
              this.kycUserInfo.aadhar_key = this.aadharKYCURLs.key;
            }
          },
            (err) => {
              this.aadharDocIsUpload = false;
              console.log(err);
              this.commonService.danger(JSON.stringify(err));
            }
          );
        } else {
          fileTransfer.upload(fileNm, this.panKYCURLs.url, options).then((data) => {
            console.log(data, 'data');
            if (data.responseCode == 200) {
              this.panDocIsUpload = true;
              console.log(this.panKYCURLs.key)
              this.kycUserInfo.pan_key = this.panKYCURLs.key;
            }
          },
            (err) => {
              this.panDocIsUpload = false;
              console.log(err);
              this.commonService.danger(JSON.stringify(err));
            });
        }
      }
    }, (err) => {
      console.log(err);
      this.commonService.danger(JSON.stringify(err));
    });
  }


  async confirmback() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            //this.router.navigate(['package-list']);
          },
        },
        {
          text: 'YES',
          role: 'confirm',
          handler: () => {
            //this.submitForm();      
            this.modalCtrl.dismiss();

            this.router.navigateByUrl('/home'), { replaceUrl: true };
          },
        },
      ],
    });
    await alert.present();
  };
  
  async removeAlert(uploadtype) {
    console.log("removed");
    this.commonService.customAlert('Re upload Image', 'Are you Sure?', () => this.chooseImage(uploadtype), () => { })
    // const alert = await this.alertCtrl.create({
    //   header: 'Are you sure?',
    //   buttons: [
    //     {
    //       text: 'NO',
    //       role: 'cancel',
    //       handler: () => {
    //         //this.router.navigate(['package-list']);
    //       },
    //     },
    //     {
    //       text: 'YES',
    //       role: 'confirm',
    //       handler: () => {
    //         //this.submitForm();      
    //         this.chooseImage(uploadtype)
    //       },
    //     },
    //   ],
    // });
    // await alert.present();
  }
}

