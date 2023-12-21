import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ActionSheetController } from '@ionic/angular';
import { PhotoService } from 'src/app/lib/services/photo.service';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { CommonService } from 'src/app/lib/services/common.service';
import { UserService } from 'src/app/lib/services/user.service';
import { Capacitor } from '@capacitor/core';
import { OnboardService } from 'src/app/lib/services/onboard.service';

@Component({
  selector: 'app-select-upi-app',
  templateUrl: './select-upi-app.page.html',
  styleUrls: ['./select-upi-app.page.scss'],
})
export class SelectUpiAppPage implements OnInit {
  upiapps = [
    {
      id: 1,
      app: 'Phone Pay',
      upi: '@ybl',
      image: 'assets/banking/Phone Pay.png',
      name: 'SarvM Retailer',
      mobile: '3213211233',
      qrImage: ''
    },
    {
      id: 2,
      app: 'Paytm',
      upi: '@paytm',
      image: 'assets/banking/Paytm.png',
      name: 'SarvM Retailer',
      mobile: '3213211233',
      qrImage: ''
    },
    {
      id: 3,
      app: 'BHIM',
      upi: '@bhim',
      image: 'assets/banking/BHIM.png',
      name: 'SarvM Retailer',
      mobile: '3213211233',
      qrImage: ''
    },
    {
      id: 4,
      app: 'G pay',
      upi: '@okaxis',
      image: 'assets/banking/G pay.png',
      name: 'SarvM Retailer',
      mobile: '3213211233',
      qrImage: ''
    },
    {
      id: 5,
      app: 'Uber',
      upi: '@uber',
      image: 'assets/banking/Uber.png',
      name: 'SarvM Retailer',
      mobile: '3213211233',
      qrImage: ''
    },
    {
      id: 6,
      app: 'Axis pay',
      upi: '@axis',
      image: 'assets/banking/Axis pay.png',
      name: 'SarvM Retailer',
      mobile: '3213211233',
      qrImage: ''
    },
    {
      id: 7,
      app: 'Mobikwik',
      upi: '@mobiquick',
      image: 'assets/banking/Mobikwik.png',
      name: 'SarvM Retailer',
      mobile: '3213211233',
      qrImage: ''
    },
    {
      id: 8,
      app: 'SBI pay',
      upi: '@sbi',
      image: 'assets/banking/SBI pay.png',
      name: 'SarvM Retailer',
      mobile: '3213211233',
      qrImage: ''
    }
  ];
  userId: any;
  userPaymentInfo: any;
  upiFormData: any;
  uploadUpiData: any;
  qrCodeURL: string;
  qr_image: string;
  upiInfo: any = [];
  form = {
    retailerData: {
      payment: {

      }
    }
  };

  upiAppName: any;
  constructor(
    private router: Router,
    private camera: Camera,
    private transfer: FileTransfer,
    public formBuilder: FormBuilder,
    private photoService: PhotoService,
    public commonService: CommonService,
    private actionSheetController: ActionSheetController,
    private userService: UserService,
    private onboardService: OnboardService,
  ) {
    // this.getUserData();
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.getUserData();
  }

  // Get user's existing details
  getUserData() {
    this.userId = this.commonService.getUserData() && this.commonService.getUserData().userId;
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.userService.getUPI(this.userId ? this.userId : null).subscribe((userDetails: any) => {
        loading.dismiss()
        this.userPaymentInfo = userDetails.data;
      }, err => {
        loading.dismiss()
        console.log(err);
      });
    })
  }

  imageData(data) {
    console.log(data, "<<<<<<<image");
  }

  selectUpi(selectedUpi) {
    let values = this.upiapps.filter(app => app.id === selectedUpi);
    this.upiAppName = values;
    for (let i = 0; i < values.length; i++) {
      this.uploadUpiData = { upi: values[i].upi, app: values[i].app, name: values[i].name, mobile: values[i].mobile, qr_image: values[i].qrImage, active: true }
    }
    this.presentActionSheet();
  }

  // Upload QR Code Image
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      cssClass: 'my-custom-class',
      mode: 'ios',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.uploadQrCodeImageFromGallery(1);
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            this.uploadQrCodeImageFromGallery(0);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
            this.uploadUpiData = [];
          }
        }]
    });
    await actionSheet.present();
  }

  // Upload QR code Image from gallery
  uploadQrCodeImageFromGallery(source) {
    this.commonService.presentLoader().then(loading => {
      this.userService.getQrCodeImageUploadUrl().subscribe((res: any) => {
        loading.present()
        if (res.data.uploadURL) {
          this.photoService.takePhoto(source).then((img) => {
            if (img?.success) {
              this.qrCodeURL = Capacitor.convertFileSrc(img.mediaPath);
              let fileNm = img.mediaPath;
              const fileTransfer: FileTransferObject = this.transfer.create();
              let options: FileUploadOptions = {
                fileKey: 'file',
                fileName: fileNm.substring(fileNm.lastIndexOf('/') + 1),
                headers: { 'Content-Type': 'image/jpg' },
                chunkedMode: false,
                httpMethod: 'PUT',
                mimeType: "image/jpg",
              }
              fileTransfer.upload(img.mediaPath, res.data.uploadURL, options).then((data) => {
                if (data.responseCode == 200) {
                  loading.dismiss()
                  this.upiFormData = {
                    "name": this.uploadUpiData.name ? this.uploadUpiData.name : 'sarvm',
                    "mobile": this.uploadUpiData.mobile,
                    "app": this.uploadUpiData?.app,
                    "upi": this.uploadUpiData.mobile.concat(this.upiAppName[0]?.upi),
                    "qr_image": res.data.url,
                    "active": true
                  }
                  this.createUserUpi(this.userId, this.upiFormData);
                }
              }, (err) => {
                loading.dismiss()
                this.commonService.danger(JSON.stringify(err));
              });
            } else {
              loading.dismiss()
            }
          });
        } else {
          loading.dismiss()
        }
      }, err => {
        loading.dismiss()
      });
    })
  }

  // Create user's details
  createUserUpi(userId, formData) {
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.userService.createUPI(userId, formData).subscribe((res: any) => {
        if (res.success) {
          loading.dismiss()
          this.commonService.success('User UPI Created !!');
          // this.getUserData();
          this.router.navigateByUrl('/scan-qr-code');
        } else if (res && res.error) {
          this.commonService.danger(res.error.message);
        }
      }, err => {
        loading.dismiss()
        this.commonService.danger(err.error.error.message)
      })
    }
    )
  }
}
