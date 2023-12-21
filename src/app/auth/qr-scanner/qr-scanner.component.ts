import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/lib/services/common.service';
import { ModalController } from '@ionic/angular';
import { PhotoService } from 'src/app/lib/services/photo.service';
import { UserService } from 'src/app/lib/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss'],
})
export class QrScannerComponent implements OnInit {

  phone: any;
  returnUrl: any;
  resultContent: any;
  constructor(public commonService: CommonService,
    private transfer: FileTransfer,
    private photoService: PhotoService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      this.returnUrl = res.returnUrl;
      this.phone = res.phone;
      console.log(res)
    })
  }

  ionViewWillEnter() {
    this.startScanner();
  }

  /**
   * @checkScannerPermission is to check barcode permission scanning permission of the device
   * @returns boolean value
   */
  async checkScannerPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    const allowed = this.checkScannerPermission().then(res => {
      BarcodeScanner.hideBackground();
      BarcodeScanner.startScan().then(res => {
        if (res.hasContent) {
          this.resultContent = res.content;
          this.toOtp();
        } else {
          console.log('No Data Found')
          this.stopScanner();
        }
      });
    }).catch(err => {
      console.log('Permission Not Granted!')
      this.stopScanner();
      history.back();
    });
  }

  toOtp() {
    this.router.navigate(['otp', btoa(JSON.stringify(this.phone))], {
      queryParams: {
        returnUrl: this.returnUrl,
        resultData: this.resultContent
      },
      replaceUrl: true
    });
  }

  stopScanner() {
    BarcodeScanner.stopScan();
  }

  ionViewWillLeave() {
    this.stopScanner();
  }

  goBack() {
    this.ionViewWillLeave()
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.returnUrl }
    });
  }
}
