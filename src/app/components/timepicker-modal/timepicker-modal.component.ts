import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-timepicker-modal',
  templateUrl: './timepicker-modal.component.html',
  styleUrls: ['./timepicker-modal.component.scss'],
})
export class TimepickerModalComponent implements OnInit {
  constructor(private modelCtrl: ModalController) {
    // this.setToday();
  }

  @Input() day: string;
  ngOnInit() {}

  showpicker = false;
  // timeValue = format(new Date(), 'yyyy-MM-dd') + 'T09:00.00.000Z';
  formattedstring = '';
  // format(new Date(), 'yyyy-MM-dd') + 'T09:00.00.000Z';

  _dismiss() {
    console.log('dismiss');
    console.log(this.day);

    this.modelCtrl.dismiss({
      timefrmModal: this.formattedstring,
    });
  }

  timeChange(value: string) {
    console.log('time change');
    console.log(value);
    this.formattedstring = value.substring(11, 16);

    console.log(this.formattedstring);
    this._dismiss();
  }
}
