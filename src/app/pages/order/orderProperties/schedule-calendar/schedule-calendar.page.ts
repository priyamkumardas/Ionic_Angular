import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ScheduleDatePage } from '../schedule-date/schedule-date.page';

@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './schedule-calendar.page.html',
  styleUrls: ['./schedule-calendar.page.scss'],
})
export class ScheduleCalendarPage implements OnInit {

  @ViewChild(IonDatetime) datetime: IonDatetime;
  @Input() type = 'date';
  @Input() contenerType = 'date';
  @Input() min;
  @Input() max;
  @Input() date_format;
  @Input() isDisabled: boolean = false;
  @Input() value;

  constructor(private modalCtrl: ModalController,) { }

  ngOnInit() {
  }

  async change(value, type) {
    /* this.datePickerValue.emit({ "value": value, "type": type });
    //console.log(value)
    this.dateSelected = 1; */

    const modal = await this.modalCtrl.create({
      component: ScheduleDatePage,
      cssClass: 'schedule-date-component-css',
      componentProps: {
        //'orderType': statusText
      }
    });
    modal.onDidDismiss().then((modelData: any) => {
      if (modelData !== null && modelData !== undefined && modelData !== "") {
        if (modelData.data.status == 'Yes') {
          //this.orderStatusChangeView(ind, orderItem, statusText);
        }
        console.log('Modal Data : ' + modelData);
      }
    });
    await modal.present();
  }

  cancel() {
    this.datetime.cancel(true);
  }

  done(value, type) {
    //this.datePickerValue.emit({ "value": value, "type": type });
    this.datetime.confirm(true);
  }

}
