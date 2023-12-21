import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { OnboardService } from 'src/app/lib/services/onboard.service';
import { PhotoService } from 'src/app/lib/services/photo.service';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Constants } from 'src/app/config/constants';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { CommonService } from 'src/app/lib/services/common.service';
import { UserService } from 'src/app/lib/services/user.service';


@Component({
  selector: 'app-bank-form',
  templateUrl: './bank-form.page.html',
  styleUrls: ['./bank-form.page.scss'],
})
export class BankFormPage implements OnInit {

  bankForm: FormGroup;
  isSubmitted = false;
  bankPassbookURLs: any;
  documentIsUpload: boolean = false;
  segment = 'UpiId';

  userId: any;
  userPaymentInfo: any;

  form = {
    retailerData: {
      payment: {
        upiInfo: {

        }
      }
    }
  };

  userUpiArray: any;

  constructor(
    private router: Router,
    private camera: Camera,
    private navCtrl: NavController,
    private transfer: FileTransfer,
    public formBuilder: FormBuilder,
    private photoService: PhotoService,
    public commonService: CommonService,
    private onboardService: OnboardService,
    private storageService: StorageService,
    private userService: UserService
  ) {
    // this.getUserData();
  }

  ngOnInit() {
    this.bankForm = this.formBuilder.group({
      beneficiaryname: ['', [Validators.required, Validators.minLength(2)]],
      bankname: ['', [Validators.required, Validators.minLength(2)]],
      accountno: ['', [Validators.required, Validators.minLength(2)]],
      reaccountno: ['', [Validators.required, Validators.minLength(2)]],
      ifsc: ['', [Validators.required, Validators.minLength(2)]],
      passbookphoto: [''],
    }, { validators: this.password.bind(this) });
  }


  ionViewWillEnter() {
    this.getUpiList();
  }

  get errorControl() {
    return this.bankForm.controls;
  }

  password(formGroup: FormGroup) {
    const { value: account } = formGroup.get('accountno');
    const { value: reaccount } = formGroup.get('reaccountno');
    return account === reaccount ? null : { accountnoNotMatch: true };
  }

  // Get user's existing details
  getUpiList() {
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.userId = this.commonService.getUserData() && this.commonService.getUserData().userId;
      this.userService.getUPI(this.userId ? this.userId : null).subscribe((userDetails: any) => {
        loading.dismiss()
        this.userPaymentInfo = userDetails.data;
      }, err => {
        console.log(err);
        loading.dismiss()
      });
    })
  }

  chooseImage() {
    this.onboardService.getBankPassbookURL().subscribe((verifidDoc: any) => {
      if (verifidDoc?.isKYCURLs.success) {
        this.bankPassbookURLs = verifidDoc?.isKYCURLs?.data.passbook_photo;
        this.photoService.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY).then((res) => {
          if (res?.success) {
            //console.log("res==>", res.mediaPath);
            let fileNm = res.mediaPath;
            const fileTransfer: FileTransferObject = this.transfer.create();
            let options: FileUploadOptions = {
              fileKey: 'file',
              fileName: fileNm.substring(fileNm.lastIndexOf('/') + 1),
              headers: { 'Content-Type': 'image/jpg' },
              chunkedMode: false,
              httpMethod: 'PUT',
              mimeType: "image/jpg",
            }
            fileTransfer.upload(res.mediaPath, this.bankPassbookURLs, options).then((data) => {
              if (data.responseCode == 200) {
                this.documentIsUpload = true;
                console.log(data + "bank Uploaded Successfully");
              }
            }, (err) => {
              this.documentIsUpload = false;
              console.log(err);
              this.commonService.danger(JSON.stringify(err));
            });
          }
        });
      }
    });
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.bankForm.valid) {
      this.commonService.danger("Please provide all the required values!");
      return false;
    } else {
      //console.log(this.bankForm.value);
      if (this.documentIsUpload) {
        console.log("success");
        this.commonService.presentLoader().then(loading => {
          loading.present()
          this.onboardService.addBankFormDetals(this.bankForm.value).subscribe((res: any) => {
            loading.dismiss()
            if (res?.isBank?.success) {
              console.log("bank", res);
              this.storageService.setItem(Constants.BANK_DETAILS, { "bank": this.bankForm.value });
              this.router.navigate(['/select-category']);
            }
          }, error => {
            loading.dismiss()
          });
        })
      } else {
        this.documentIsUpload = false;
        this.commonService.danger("please upload any document image");
      }
    }
  }

  segmentChanged(e) {
    this.segment = e.detail.value;
  }

  isChecked(event) {
    if (event.target.checked) {
      console.log("Checked!");
      console.log(event.target.checked);
      // this.form?.retailerData?.payment?.upis['active'] = false;
    }
  }

  gotToQrScanPage(inx) {
    this.router.navigate(['/scan-qr-code', { data: JSON.stringify(inx) }]);
  }

  onBack() {
    this.navCtrl.back();
  }
}
