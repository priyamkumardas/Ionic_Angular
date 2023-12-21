import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-schedule-date',
  templateUrl: './schedule-date.page.html',
  styleUrls: ['./schedule-date.page.scss'],
})
export class ScheduleDatePage implements OnInit {

  constructor(private modalCtrl: ModalController,) { }

  ngOnInit() {
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}
