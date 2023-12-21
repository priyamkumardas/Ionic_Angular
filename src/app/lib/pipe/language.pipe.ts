import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from 'src/app/config/constants';

@Pipe({
  name: 'language',
  pure: false
})
export class LanguagePipe implements PipeTransform {

  transform(value: any, finalText?: string, ...args: unknown[]): unknown {
    if (value) {
      if (localStorage.getItem(Constants.ALL_LANGUAGES)) {
        const data = JSON.parse(unescape(atob(localStorage.getItem(Constants.ALL_LANGUAGES))));
        if(data[value] != undefined){
          value = data[value];
        } else {
          value = finalText;
        }
        return value;
      }      
    } else {
      return value;
    }
  }
}
