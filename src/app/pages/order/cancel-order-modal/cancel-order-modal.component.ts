import { Component, OnInit, Input } from '@angular/core';
import { ModalController,IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-cancel-order-modal',
  templateUrl: './cancel-order-modal.component.html',
  styleUrls: ['./cancel-order-modal.component.scss'],
})
export class CancelOrderModalComponent implements OnInit {
  @Input() orderType: any;
  @Input() isOrder: boolean
  @Input() amount: any;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.orderType = this.orderType.charAt(0).toUpperCase() + this.orderType.slice(1).toLowerCase();
    console.log(this.orderType);
  }

  viewYes() {
    this.modalCtrl.dismiss({"status":"Yes"});
  }

  viewNo() {
    this.modalCtrl.dismiss({"status":"No"});
  }
}
