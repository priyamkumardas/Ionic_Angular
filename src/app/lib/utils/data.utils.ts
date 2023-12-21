import * as moment from 'moment';

export class DataUtils {
  static isEmpty(data: string) {
    return !data || data.trim().length === 0;
  }

  static isObjectEmpty(obj: object) {
    return !obj || Object.keys(obj).length === 0;
  }

  static getTodayMoment() {
    //return moment();
    return moment().format('YYYY-MM-DD');
  }

  static getDate(input) {
    return moment(input).format('YYYY-MM-DD HH:mm');
  }

  static getDateWith(input) {
    return moment(input).format('DD-MM-YYYY');
  }
  
  static getValidTime(time, date) {
    if (!date) {
      date = '2020-01-01';
    }
    return moment(time).isValid() ? moment(`${date} ${moment(time).format('HH:mm')}`) : moment(`${date} ${time}:00`);
  }
}
