import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/lib/services/common.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { PhotoService } from 'src/app/lib/services/photo.service';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { Capacitor } from '@capacitor/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { UserService } from 'src/app/lib/services/user.service';
import { OnboardService } from 'src/app/lib/services/onboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Input } from '@angular/core';
import { DeleteQRComponent } from 'src/app/components/delete-qr/delete-qr.component';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-scan-qrcode',
  templateUrl: './scan-qrcode.component.html',
  styleUrls: ['./scan-qrcode.component.scss'],
})
export class ScanQrcodeComponent implements OnInit {

  @Input() isOrder: boolean
  @Input() orderType: any;

  upiInfo: any = [];
  form = {
    retailerData: {
      payment: {

      }
    }
  };

  qr_image: any;
  upiId: any;
  qrCodeURL: string;
  userUpiData: any;
  userId: any;
  userPaymentInfo: any;
  displayUserPaymentInfo: any;
  displayUserUpiIcon: any;
  displayUserName: any;
  displayUserMobile: any;
  displayUserUpi: any;

  retailerId: any;
  paymentInfoId: any;

  getIndex: any;
  upiFormData: any;

  constructor(
    public commonService: CommonService,
    private userService: UserService,
    private photoService: PhotoService,
    private camera: Camera,
    private transfer: FileTransfer,
    private actionSheetController: ActionSheetController,
    private onboardService: OnboardService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    /**
     * isOrder:- it is a flag coming from cancel order modal popup which indicates if this page has to show content for order page 
     * or accessed from normal route....
     */
    if(this.isOrder){
      let data = this.activatedRoute.snapshot.paramMap.get('data') ?
        this.activatedRoute.snapshot.paramMap.get('data') : '0'; //if data is null then it will take 0 by default
      if (data) {
        this.getIndex = JSON.parse(data);
        console.log("Got index of UPI: ", this.getIndex);
        this.getUserData();
      }
    }
  }

  ionViewWillEnter() {
    let data = this.activatedRoute.snapshot.paramMap.get('data') ?
      this.activatedRoute.snapshot.paramMap.get('data') : '0'; //if data is null then it will take 0 by default
    if (data) {
      this.getIndex = JSON.parse(data);
      console.log("Got index of UPI: ", this.getIndex);
      this.getUserData();
    }
  }


  // Get user's existing details from backend
  getUserData() {
    this.userId = this.commonService.getUserData() && this.commonService.getUserData().userId;
    //userDetails api call
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.userService.getUPI(this.userId ? this.userId : null).subscribe((upiDetails: any) => {
        loading.dismiss()
        this.userPaymentInfo = upiDetails.data;
        console.log(this.userPaymentInfo);
        if (!isNaN(this.getIndex)) {
          // this.displayUserPaymentInfo = this.userPaymentInfo[this.getIndex].qrImage;
          this.displayUserPaymentInfo = this.userPaymentInfo[this.getIndex]?.qr_image ? this.userPaymentInfo[this.getIndex]?.qr_image : './assets/banking/not-found.png';
          // Display User name, mobile, UPI icon and UPI id after page load
          this.displayUserUpiIcon = this.userPaymentInfo[this.getIndex]?.app;
          this.displayUserName = this.userPaymentInfo[this.getIndex]?.name;
          this.displayUserMobile = this.userPaymentInfo[this.getIndex]?.mobile;
          this.displayUserUpi = this.userPaymentInfo[this.getIndex]?.upi;

          this.retailerId = this.userPaymentInfo[this.getIndex]?.r_id;
          this.paymentInfoId = this.userPaymentInfo[this.getIndex]?.payment_info_id;
        }
        // else {
        //   this.router.navigateByUrl('/bank-form');
        // }
      }, err => {
        console.log(err);
        loading.dismiss()
      });
    })
  }

  changeQR(index) {
    this.getIndex = index
    // this.displayUserPaymentInfo = this.userPaymentInfo[this.getIndex].qrImage;
    this.displayUserPaymentInfo = this.userPaymentInfo[this.getIndex]?.qr_image ? this.userPaymentInfo[this.getIndex]?.qr_image : './assets/banking/not-found.png';;
    this.displayUserUpiIcon = this.userPaymentInfo[this.getIndex]?.app;
    this.displayUserName = this.userPaymentInfo[this.getIndex]?.name;
    this.displayUserMobile = this.userPaymentInfo[this.getIndex]?.mobile;
    this.displayUserUpi = this.userPaymentInfo[this.getIndex]?.upi;
    this.retailerId = this.userPaymentInfo[this.getIndex]?.r_id;
    this.paymentInfoId = this.userPaymentInfo[this.getIndex]?.payment_info_id;
    console.log(this.displayUserUpiIcon);
  }

  async openDeleteModal(rId, pInfoId) {
    if(this.userPaymentInfo?.length != 0) {
      const model = await this.modalCtrl.create({
        component: DeleteQRComponent,
        cssClass: 'delete-qr'
      })
      await model.present()
      const { data } = await model.onWillDismiss()
      model.onDidDismiss().then(() => {
        if (data.status == 'Yes') {
          this.deleteUpi(rId, pInfoId);
        }
      })
    } else {
      this.commonService.toast('No UPI Account is Linked!');
    }
  }

  /*
  removeQrCode(){
    let retailerId = this.userPaymentInfo[this.getIndex].r_id;
    let paymentInfoId = this.userPaymentInfo[this.getIndex].payment_info_id;
    this.commonService.alert('Are you Sure.', 'Delete the UPI ID?', 'Yes', 'No', () => this.deleteUpi(retailerId, paymentInfoId), () => { })
  }
  */

  deleteUpi(retailerId, paymentInfoId) {
    // this.commonService.presentProgressBarLoading()
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.userService.deleteUPI(retailerId, paymentInfoId).subscribe((res: any) => {
        console.log(res.success);
        loading.dismiss()
        if (res.success) {
          this.commonService.success('Removed Successfully !');
          console.log(this.userPaymentInfo.length);
          if (this.userPaymentInfo.length > 1) {
            if (this.getIndex == 0) {
              this.forwardQR('next');
              this.getUserData();
              this.getIndex = 0;
            } else {
              this.getIndex = this.getIndex - 1;
              this.getUserData();
            }
          } else {
            this.getUserData();
            this.router.navigateByUrl('/bank-form');
          }
        }
      }, err => {
        loading.dismiss()
      })
    });
  }

  forwardQR(isBackorNext) {
    let length = this.userPaymentInfo.length
    if (isBackorNext == 'next') {
      if (this.getIndex == length - 1) {
        this.getIndex = 0;
        this.changeQR(this.getIndex)
      } else {
        this.getIndex = this.getIndex + 1
        this.changeQR(this.getIndex)
      }
    } else {
      if (this.getIndex == 0) {
        this.getIndex = length - 1
        this.changeQR(this.getIndex)
      } else {
        this.getIndex = this.getIndex - 1
        this.changeQR(this.getIndex)
      }
    }
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
            // this.uploadUpiId = [];
          }
        }]
    });
    await actionSheet.present();
  }

  // Upload QR code Image from gallery
  uploadQrCodeImageFromGallery(source) {
    this.userService.getQrCodeImageUploadUrl().subscribe((res: any) => {
      this.commonService.presentLoader().then(presentLoader => {
        presentLoader.present()
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
                  //upi has to be changed
                  console.log("getIndex: ", this.getIndex);
                  console.log("userPaymentInfo: ", this.userPaymentInfo[this.getIndex]);
                  this.upiFormData = {
                    "active": true,
                    "app": this.userPaymentInfo[this.getIndex].app,
                    "mobile": this.userPaymentInfo[this.getIndex].mobile,
                    "name": this.userPaymentInfo[this.getIndex].name ? this.userPaymentInfo[this.getIndex].name : 'sarvm',
                    "qr_image": res.data.url,
                    "upi": this.userPaymentInfo[this.getIndex].upi
                  }
                  console.log("upiFormData: ", this.upiFormData);
                  let retailerId = this.userPaymentInfo[this.getIndex].r_id;
                  let paymentInfoId = this.userPaymentInfo[this.getIndex].payment_info_id;
                  presentLoader.dismiss()
                  this.updateUpi(retailerId, paymentInfoId, this.upiFormData, presentLoader);
                  // this.getUserData();
                }
              }, (err) => {
                console.log(err);
                presentLoader.dismiss()
                this.commonService.danger(JSON.stringify(err));
              });
            } else {
              presentLoader.dismiss()
            }
          });
        } else {
          presentLoader.dismiss()
        }
      });
    })
  }

  // ---- Not using for now --- //
  // Update user's details
  updateUpi(retailerId, paymentInfoId, formData, presentLoader?) {
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.userService.updateUPI(retailerId, paymentInfoId, formData).subscribe((res: any) => {
        loading.dismiss()
        if (res.success) {
          this.commonService.success('User UPI Updated !!');
          this.getUserData();
        } else if (res && res.error) {
          this.commonService.danger(res.error.message);
        }
        loading.dismiss()
      }, err => {
        loading.dismiss()
        this.commonService.danger(err.error.error.message)
      })
    })
  }
}
