import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ReportService } from 'src/app/lib/services/report.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-invite-customer-modal',
  templateUrl: './invite-customer-modal.component.html',
  styleUrls: ['./invite-customer-modal.component.scss'],
})
export class InviteCustomerModalComponent implements OnInit {
  @Input() userPhone: String;

  msgBody: any

  constructor(private modalCtrl: ModalController,
    private alertController: AlertController,
    private reportService: ReportService,
    private inappBrowser: InAppBrowser,
  ) { }

  ngOnInit() {
    console.log(this.userPhone);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async sendMessageBy(data) {
    console.log(data);
    if (data == '0') {
      this.msgBody = this.reportService.Individual_Message_BODY
      let url = 'https://wa.me/' + "+91" + this.userPhone.toString() + '?text=' + this.msgBody;
      const inappBrowser = this.inappBrowser.create(url, '_system', 'location=no');
    } else if (data == '1') {
      window.location.href = "tel:+91" + this.userPhone;
    } else {
      this.showConfirm(this.userPhone);
    }
  }

  showConfirm(phoneNumber) {
    this.msgBody = this.reportService.Individual_Message_BODY
    this.alertController.create({
      header: 'Send Referral Invite',
      subHeader: 'Carrier SMS charges may apply',
      message: 'Are you sure? You want to send referral invite to this number?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
          },
        },
        {
          text: 'Yes!',
          handler: () => {
            this.reportService.sendSms(phoneNumber, this.msgBody)
          },
        },
      ],
    }).then((res) => {
      res.present();
    });
  }
}