import { Component, OnInit } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Capacitor } from '@capacitor/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/lib/services/common.service';
import { PhotoService } from 'src/app/lib/services/photo.service';
import { UserService } from 'src/app/lib/services/user.service';
import { UserAssignRoleComponent } from '../user-assign-role/user-assign-role.component';
import { UserSalaryTypeComponent } from '../user-salary-type/user-salary-type.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {
  data: any;
  id: any;
  userProfileURL: string;
  checkbox;
  form = {
    phone: '',
    firstName: '',
    lastName: '',
    role: '',
    salary: '',
    salaryType: '',
    profileImage: '',
  };
  clickDisable

  constructor(private actionSheetController: ActionSheetController,
    private router: Router,
    private route: ActivatedRoute,
    public commonService: CommonService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private photoService: PhotoService,
    private transfer: FileTransfer,) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.route.params.subscribe(res => {
      this.id = res.id;
      if (this.id != 0) {
        this.getUserbyId(res.id);
      }
    })
  }

  getUserbyId(id) {
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.userService.getDeliveryBoyById(id).subscribe(res => {
        loading.dismiss()
        this.data = res['data'];
        console.log(this.data);
        this.form.firstName = this.data.userData.basicInformation.personalDetails.firstName;
        this.form.phone = this.data.userData.phone;
        this.form.role = 'Delivery Person';
        this.form.profileImage = this.data.userData.basicInformation.personalDetails.profileImage;
        this.form.salary = this.data.deliveryData.salary;
        this.form.salaryType = this.data.deliveryData.salaryType;
        this.id = this.data.deliveryData.userId;
        console.log(this.data.deliveryData);
      }, err => {
        loading.dismiss()
        console.log(err)
        this.commonService.danger(err.error.error.message.message ? err.error.error.message.message : err.error.error.message)
      })
    })
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      cssClass: 'my-custom-class',
      mode: 'ios',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.addPhotoToGallery(1);
        }
      }, {
        text: 'Gallery',
        handler: () => {
          this.addPhotoToGallery(0);
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  addPhotoToGallery(source) {
    this.commonService.presentLoading();
    this.userService.getUserProfileImageUploadUrl().subscribe((res: any) => {
      if (res.data.uploadURL) {
        console.log(res.data.uploadURL);
        this.photoService.takePhoto(source).then((img) => {
          console.log(img)
          console.log(Capacitor.convertFileSrc(img.mediaPath))
          if (img?.success) {
            this.userProfileURL = Capacitor.convertFileSrc(img.mediaPath);
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
              console.log(res.data.url);
              if (data.responseCode == 200) {
                this.form.profileImage = res.data.url;
              }
            }, (err) => {
              this.commonService.danger(JSON.stringify(err));
            });
          }
        });
      }
      this.commonService.dissmiss_loading();
    }, err => {
      this.commonService.dissmiss_loading();
    });
  }

  addUserDetails() {
    if ((parseInt(this.form.salary) < 0)) {
      this.commonService.danger('Please enter valid salary.');
      return;
    }
    console.log(this.form);
    this.commonService.presentLoader().then(presentLoader => {
      presentLoader.present()
      this.userService.addDeliveryBoy(this.form).subscribe((res: any) => {
        presentLoader.dismiss()
        if (res.success) {
          this.commonService.success('User Data Updated !!')
          history.back();
        } else if (res && res.error) {
          this.commonService.danger(res.error.message);
        }
      }, err => {
        presentLoader.dismiss()
        this.commonService.danger(err.error.error.message)
      })
    })
  }

  async openSalaryModal() {
    this.clickDisable = 'disableClickCss'
    const model = await this.modalCtrl.create({
      component: UserSalaryTypeComponent,
      cssClass: 'DeliveryDayPreference-component-css',
      componentProps: {
        active: this.form.salaryType,
      },
    });
    await model.present();
    const { data } = await model.onWillDismiss();
    this.clickDisable = ''
    console.log(data);
    this.form.salaryType = data;
    console.log(this.form.salaryType);
  }

  async openRoleModal() {
    this.clickDisable = 'disableClickCss'
    const model = await this.modalCtrl.create({
      component: UserAssignRoleComponent,
      cssClass: 'DeliveryDayPreference-component-css',
      componentProps: {
        active: this.form.role,
      },
    });
    await model.present();
    const { data } = await model.onWillDismiss();
    this.clickDisable = ''
    console.log(data);
    this.form.role = data;
    console.log(this.form.role);
  }
  async datachanged(e: any) {
    this.checkbox = e.detail.checked;
  }

  checkSalary(event) {
    if (event.detail.value < 0) {
      this.commonService.danger('Salary cannot be in negative');
      return;
    }
  }


  updateUserDetails() {
    this.data.deliveryData.salary = this.form.salary;
    this.data.deliveryData.salaryType = this.form.salaryType;
    if (parseInt(this.data.deliveryData.salary) < 0) {
      this.commonService.danger('Please enter valid salary.');
      return;
    }
    this.data.deliveryData.role = this.form.role;
    this.data.deliveryData.profileImage = this.form.profileImage;
    this.commonService.presentLoading();
    this.userService.updateDeliveryBoy(this.data.deliveryData).subscribe((res: any) => {
      this.commonService.dissmiss_loading();
      if (res.success) {
        this.commonService.success('User Data Updated !!')
        history.back();
      } else if (res && res.error) {
        this.commonService.danger(res.error.message);
      }
    }, err => {
      this.commonService.dissmiss_loading();
      this.commonService.danger('Something Went Wrong !!')
    })
  }
}
