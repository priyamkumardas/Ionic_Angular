import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device'
import { LoadingController, ToastController, PopoverController, AlertController } from '@ionic/angular';
import { Constants } from 'src/app/config/constants';
import { StorageService } from 'src/app/lib/services/storage.service';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { App } from '@capacitor/app';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController } from '@ionic/angular';
import { LogoutPopUpComponent } from 'src/app/components/logout-pop-up/logout-pop-up.component';
import { Subject } from 'rxjs';
import { HelpVideoComponent } from 'src/app/support/help-video/help-video.component';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  state = false;
  userData: any;
  isLoader: any;
  isLoading: boolean;
  appCodeVersion;
  appCodeVersionName;
  remoteAppVersionName;
  remoteAppUpdateLink;
  hasCurrentLocation: boolean = false;
  deviceId: any;
  taskCompleted: boolean = false;
  subject = new Subject<boolean>();
  isToastVisible: boolean;
  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    public popoverCtrl: PopoverController,
    private storageService: StorageService,
    private appVersion: AppVersion,
    private platform: Platform,
    private iab: InAppBrowser,
    private socialSharing: SocialSharing,
    private modalCtrl: ModalController
  ) {
    // this.setUserData()
    // console.log(this.userData)
    if (this.storageService.getItem(Constants.AUTH_TOKEN)) {
      this.setUserData()
    }
    this.getDeviceId()
  }

  async getDeviceInfo() {
    const info = await Device.getInfo();
    // console.log(info);
  }

  async getDeviceId() {
    this.deviceId = await Device.getId();
    // console.log(this.deviceId);
  }
  appCheckUpdate() {
    this.appVersion.getVersionNumber().then(versionName => {
      this.appCodeVersionName = versionName;
      this.compareAppVersionWithServerVersion(this.appCodeVersionName, this.remoteAppVersionName);
      console.log("verson name", versionName);
    })
    this.appVersion.getVersionCode().then(versionCode => {
      this.appCodeVersion = versionCode;
      console.log("verson code", versionCode);
    })
    //  this.appCodeVersion = this.appVersion.getVersionCode();
    //  this.appCodeVersionName = this.appVersion.getVersionNumber();
    //  console.log(this.appCodeVersionName);
    //  console.log(this.appCodeVersion);
  }

  compareAppVersionWithServerVersion(localVersion, remoteVersion) {
    //let splittedRemoteVersion,splittedLocalVersion;

    this.platform.ready().then(() => {
      if (this.platform.is("android")) {
        this.remoteAppUpdateLink = remoteVersion.android.updateUrl;
        this.compareVersions(remoteVersion.android.min.split('.'), localVersion.split('.'))
      } else if (this.platform.is("ios")) {
        this.remoteAppUpdateLink = remoteVersion.ios.updateUrl;
        this.compareVersions(remoteVersion.ios.min.split('.'), localVersion.split('.'))
      }
    });
  }

  compareVersions(splittedRemoteVersion, splittedLocalVersion) {
    if (splittedRemoteVersion[0] >= splittedLocalVersion[0]) {
      if (splittedRemoteVersion[0] > splittedLocalVersion[0]) {
        this.updateApp()
      } else {
        if (splittedRemoteVersion[1] >= splittedLocalVersion[1]) {
          if (splittedRemoteVersion[1] > splittedLocalVersion[1]) {
            this.updateApp()
          } else {
            if (splittedRemoteVersion[2] > splittedLocalVersion[2]) {
              this.updateApp()
            }
          }

        }
      }
    }
  }

  async updateApp() {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: "Update",
      subHeader: "Please update to newer version",
      buttons: [
        {
          text: 'Confirm',
          // role: 'confirm',
          handler: () => {
            //okAction();
            this.iab.create(this.remoteAppUpdateLink, '_system');
            App.exitApp();
          },
        },
      ],
    });
    await alert.present();
  }

  setUserData() {
    this.userData = this.parseJwt(
      this.storageService.getItem(Constants.AUTH_TOKEN)
    );
  }

  getUserData() {
    return this.parseJwt(this.storageService.getItem(Constants.AUTH_TOKEN));
  }

  parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  async present() {
    this.state = true;
    return await this.loadingController
      .create({
        mode: 'ios',
        spinner: 'circles',
        message: 'Loading...',
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.state) {
            a.dismiss();
          }
        });
      });
  }

  async dismiss() {
    this.state = false;
    //return await this.loadingController.dismiss().then(() => console.log('dismissed'));
    while ((await this.loadingController.getTop()) !== undefined) {
      await this.loadingController.dismiss();
    }
  }

  async presentLoading() {
    const that = this;
    this.isLoading = true;
    return await this.loadingController.create({
      mode: 'ios',
      message: 'Loading...',
      spinner: 'circles',

    }).then(a => {
      a.present().then(() => {
        console.log('loading presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('loading abort presenting'));
        }
      });
    });

    // const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }

  presentProgressBarLoading() {
    this.isLoading = true;
  }

  closeProgressBarLoading() {
    this.isLoading = false;
  }

  async dissmiss_loading() {
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
    }
    return null;
  }


  async presentLoader(): Promise<HTMLIonLoadingElement> {
    return await this.loadingController.create({
      mode: 'ios',
      message: 'Loading...',
      spinner: 'circles',
      animated: true
    })
  }

  async dismissLoader() {
    console.log(this.isLoader, 'this.isLoading')
    this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  }

  async presentToast(msg: string) {
    this.isToastVisible = true;
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      cssClass: 'iontoast',
      position: 'bottom',
    });
    toast.present();
    toast.onDidDismiss().then((data) => {
      this.isToastVisible = false;
    })
  }

  async dismissToast() {
    if (this.isToastVisible) {
      this.toastController.dismiss()
    }
  }

  async success(msg: string) {
    this.isToastVisible = true;
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'success',
      cssClass: 'iontoast',
      position: 'bottom',
    });
    toast.present();
    toast.onDidDismiss().then((data) => {
      this.isToastVisible = false;
    })
  }

  async danger(msg: string) {
    this.isToastVisible = true;
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: 'danger',
      cssClass: 'iontoast',
      position: 'bottom',
    });
    toast.present();
    toast.onDidDismiss().then((data) => {
      this.isToastVisible = false;
    })
  }

  async toast(message: string) {
    this.isToastVisible = true;
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      mode: 'md',
      color: 'dark',
      cssClass: 'iontoast',
      position: 'bottom',
    });
    toast.present();
    toast.onDidDismiss().then((data) => {
      this.isToastVisible = false;
    })
  }

  alert(
    header: string,
    message: string,
    okLabel: string,
    cancelLabel: string,
    okAction: () => void,
    cancelAction: () => void
  ) {
    const buttons = [];
    if (okLabel) {
      buttons.push({ text: okLabel, handler: okAction });
    }
    if (cancelLabel) {
      buttons.push({
        text: cancelLabel,
        role: 'cancel',
        handler: cancelAction,
      });
    }
    this.alertController
      .create({ mode: 'ios', header, message, buttons, backdropDismiss: false })
      .then((alert) => alert.present());
  }

  featureNotAvailable() {
    this.presentToast('Feature not Available.');
  }

  createArrayofObject(data): any {
    const arrayOfObj = {};
    if (data) {
      data.forEach((v) => {
        arrayOfObj[v.id] = v;
      });
    }
    return arrayOfObj;
  }

  async customAlert(header, subHeader, yesCallBack, noCallBack, forBack?) {
    if (forBack ? this.taskCompleted : true) {
      const model = await this.modalCtrl.create({
        component: LogoutPopUpComponent,
        cssClass: 'cancel-order-modal',
        componentProps: {
          header: header,
          subHeader: subHeader,
          forBack: forBack,
        }
      })
      await model.present()
      const { data } = await model.onWillDismiss()
      if (data.status == 'Yes') {
        if (forBack) {
          this.subject.next(true);
        } else {
          this.subject.next(false);
          yesCallBack();
        }
      } else {
        noCallBack();
      }
    } else {
      setTimeout(() => {
        this.subject.next(true);
      }, 200)
    }
  }

  async presentLoaderForHelp(loading) {
    return await loading.present();
  }

  async openHelpVideo(link) {
    const loading = await this.loadingController.create({
      mode: 'ios',
      spinner: 'circles',
      message: 'Loading...',
    });
    this.presentLoaderForHelp(loading);
    const model = await this.modalCtrl.create({
      component: HelpVideoComponent,
      breakpoints: [0, 0.45],
      initialBreakpoint: 0.45,
      mode: 'ios',
      // cssClass: '',
      componentProps: {
        link: link
      }
    });
    await model.present();
    loading.dismiss();
  }

  /**
   * 
   * @param photo photo is a base64 url
   * @param shopDetails it is used for giving saved picture starting name
   * @returns saves picture to gallery
   */
  async savePicture(photo: any, shopDetails: string) {
    const base64Data = photo;
    // Write the file to the data directory
    const fileName = shopDetails + new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents
    }).then((info) =>
      this.success('Image saved successfully'))
      .catch((e) => {
        console.log('Error occurred while doing stat: ', e)
        this.danger("Image not saved")
      });
    console.log(savedFile, 'savedFile')
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

  /**
   * 
   * @param base64url it brings base64 url which helps us to convert base64 to image
   * @param fileName is to assign name's for the shared files
   */

  async shareQr(uniquelink: any, shopName: any, files?: any) {
    this.socialSharing.shareWithOptions({
      message: `Here is my online shop details, Name: ${shopName}`,
      files: [files],
      url: 'Link : ' + uniquelink + ' Powered by https://www.sarvm.ai',
    })
  }
}
