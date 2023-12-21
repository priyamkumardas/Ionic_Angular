import { Component, OnInit,Input } from '@angular/core';
import { ModalController,IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-logout-pop-up',
  templateUrl: './logout-pop-up.component.html',
  styleUrls: ['./logout-pop-up.component.scss'],
})
export class LogoutPopUpComponent implements OnInit {

  @Input() header:string;
  @Input() subHeader:string;
  
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}
  viewYes() {
    this.modalCtrl.dismiss({"status":"Yes"});
  }

  viewNo() {
    this.modalCtrl.dismiss({"status":"No"});
    }
}
