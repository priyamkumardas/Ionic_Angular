import { Component, OnInit } from '@angular/core';
import { ModalController,IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-delete-qr',
  templateUrl: './delete-qr.component.html',
  styleUrls: ['./delete-qr.component.scss'],
})
export class DeleteQRComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}
  viewYes() {
    this.modalCtrl.dismiss({"status":"Yes"});
  }

  viewNo() {
    this.modalCtrl.dismiss({"status":"No"});
    }

}
