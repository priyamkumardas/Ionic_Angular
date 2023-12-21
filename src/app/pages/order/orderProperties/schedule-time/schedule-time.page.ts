import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/lib/services/common.service';
import { ScheduleCalendarPage } from '../schedule-calendar/schedule-calendar.page';

@Component({
  selector: 'app-schedule-time',
  templateUrl: './schedule-time.page.html',
  styleUrls: ['./schedule-time.page.scss'],
})
export class ScheduleTimePage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private commonService: CommonService) { }

  ngOnInit() {
  }

  async scheduleCalendar() {
    const modal = await this.modalCtrl.create({
      component: ScheduleCalendarPage,
      cssClass: 'schedule-calendar-component-css',
      componentProps: {
        //'orderType': statusText
      }
    });
    modal.onDidDismiss().then((modelData: any) => {
      if (modelData !== null && modelData !== undefined && modelData !== "") {
        if(modelData.data.status == 'Yes'){
          //this.orderStatusChangeView(ind, orderItem, statusText);
        }
        console.log('Modal Data : ' + modelData);
      }
    });
    await modal.present();
  }

  cancel() {
    this.modalCtrl.dismiss();
  }
}
