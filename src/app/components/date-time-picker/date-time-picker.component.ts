import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
})
export class DateTimePickerComponent implements OnInit {

  @ViewChild(IonDatetime) datetime: IonDatetime;
  @Input() type = 'date';
  @Input() contenerType = 'date';
  @Input() min;
  @Input() max;
  @Input() date_format;
  @Input() date_info;
  @Input() isDisabled: boolean = false;
  @Input() value;
  @Output() datePickerValue: EventEmitter<any> = new EventEmitter<any>();
  dateValue = '';
  today;
  dateSelected;
  preDefineDate;

  constructor() { }

  ngOnInit() {
    // Added condition to get defined date value from order component
    // this.value = this.getCurrentDate(); 
    if (this.value === undefined) {
      this.value = this.getCurrentDate();
    }
    // console.log(this.date_info);
    //this.min = this.getCurrentDate();
    if (this.value !== undefined) {
      this.preDefineDate = this.value;
    }
    this.dateSelected = 0;
    this.today = this.getCurrentDate();
  }

  getCurrentDate(format: string = 'YYYY-MM-DD') {
    if (this.date_format) {
      return moment().format(this.date_format);
    } else {
      return moment().format(format);
    }
  }

  change(value, type) {
    // this.datePickerValue.emit({ "value": value, "type": type });
    // console.log(value)
    this.dateSelected = 1;
  }

  cancel() {
    // this.datePickerValue.emit({ "value": this.preDefineDate, "type": 'date' });
    this.datetime.cancel(true);
  }

  done(value, type) {
    this.datePickerValue.emit({ "value": value, "type": type });
    this.datetime.confirm(true);
  }
}
