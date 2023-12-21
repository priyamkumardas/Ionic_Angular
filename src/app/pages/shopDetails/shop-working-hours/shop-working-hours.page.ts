import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NavController } from '@ionic/angular';
import { CommonService } from 'src/app/lib/services/common.service';
import { OnboardService } from 'src/app/lib/services/onboard.service';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Constants } from 'src/app/config/constants';
import { DataUtils } from 'src/app/lib/utils/data.utils';
import { ValidatorUtils } from 'src/app/lib/utils/validator.utils';

@Component({
  selector: 'app-shop-working-hours',
  templateUrl: './shop-working-hours.page.html',
  styleUrls: ['./shop-working-hours.page.scss'],
})
export class ShopWorkingHoursPage implements OnInit {

  //isSaveEnable: boolean = true;
  //selectedTime: any = {};
  /* anArray: any = []; */

  format = 'HH:mm';
  isEnableToggle: boolean = true;
  customDateTime: any = [];

  isCustomTiemValidArr: any = [];
  isCustomTiemValid: boolean;

  constructor(private router: Router,
    private navCtrl: NavController,
    private commonService: CommonService,
    private onboardService: OnboardService,
    private changeDetectorRef: ChangeDetectorRef,
    private storageService: StorageService) {
    //this.selectedTime = [];
  }

  weekday = [
    { "dName": 'MON', isEnable: true },
    { "dName": 'TUE', isEnable: true },
    { "dName": 'WED', isEnable: true },
    { "dName": 'THU', isEnable: true },
    { "dName": 'FRI', isEnable: true },
    { "dName": 'SAT', isEnable: true },
    { "dName": 'SUN', isEnable: true }
  ];
  timeSlote: any = [
    {
      'time01': this.getCurrentDate(), 'time02': this.getCurrentDate()
    },
    {
      'time11': this.getCurrentDate(), 'time12': this.getCurrentDate()
    },
  ];
  collectTiems: any = [];


  /* for custom day wise */
  fullWeekDay: any = [
    {
      "dName": 'MON', isEnable: false,
      "alltime": [{ 'timeMON01': this.getCurrentDate(), 'timeMON02': this.getCurrentDate() }, { 'timeMON11': this.getCurrentDate(), 'timeMON12': this.getCurrentDate() }]
    },
    {
      "dName": 'TUE', isEnable: false,
      "alltime": [{ 'timeTUE01': this.getCurrentDate(), 'timeTUE02': this.getCurrentDate() }, { 'timeTUE11': this.getCurrentDate(), 'timeTUE12': this.getCurrentDate() }]
    },
    {
      "dName": 'WED', isEnable: false,
      "alltime": [{ 'timeWED01': this.getCurrentDate(), 'timeWED02': this.getCurrentDate() }, { 'timeWED11': this.getCurrentDate(), 'timeWED12': this.getCurrentDate() }]
    },
    {
      "dName": 'THU', isEnable: false,
      "alltime": [{ 'timeTHU01': this.getCurrentDate(), 'timeTHU02': this.getCurrentDate() }, { 'timeTHU11': this.getCurrentDate(), 'timeTHU12': this.getCurrentDate() }]
    },
    {
      "dName": 'FRI', isEnable: false,
      "alltime": [{ 'timeFRI01': this.getCurrentDate(), 'timeFRI02': this.getCurrentDate() }, { 'timeFRI11': this.getCurrentDate(), 'timeFRI12': this.getCurrentDate() }]
    },
    {
      "dName": 'SAT', isEnable: false,
      "alltime": [{ 'timeSAT01': this.getCurrentDate(), 'timeSAT02': this.getCurrentDate() }, { 'timeSAT11': this.getCurrentDate(), 'timeSAT12': this.getCurrentDate() }]
    },
    {
      "dName": 'SUN', isEnable: false,
      "alltime": [{ 'timeSUN01': this.getCurrentDate(), 'timeSUN02': this.getCurrentDate() }, { 'timeSUN11': this.getCurrentDate(), 'timeSUN12': this.getCurrentDate() }]
    }
  ];


  ngOnInit() {
    this.collectTiems = Object.assign(this.timeSlote);
  }


  selectAll(event) {
    if (event.detail.checked) {
      this.weekday.filter((item) => { item.isEnable = true });
      this.isEnableToggle = true;
    } else {
      this.weekday.filter((item) => { item.isEnable = false });
      this.isEnableToggle = false;
    }
  }


  onRowClick(id: any, index: any) {
    if (id.isEnable) {
      this.weekday.filter((item, ind) => {
        if (item.dName === id.dName && index == ind) {
          id.isEnable = false;
        }
      });
    } else {
      this.weekday.filter((item, ind) => {
        if (item.dName === id.dName && index == ind) {
          id.isEnable = true;
        }
      });
    }

    this.isEnableToggle = this.weekday.every((i) => {
      if ((i.dName == "SAT") || (i.dName == "SUN")) {
        return true;
      }
      return i.isEnable === true;
    });
  }

  dateValue(item, key): any {
    let val;
    if (item[key] != "" && item[key] != undefined && item[key] != null) {
      val = moment(item[key]).format('h:mm a');
    }
    return val;
  }

  fullDateValue(item, key): any {
    let val;
    if (item[key] != "" && item[key] != undefined && item[key] != null) {
      val = item[key];
    }
    return val;
  }


  change(event) {
    console.log(event);

    this.collectTiems.forEach((obj, index) => {
      return Object.entries(obj).find(([ky, val]) => {
        if (event.type === ky) {
          return obj[ky] = event.value;
        }
      });
    });
    //console.log(this.collectTiems);

    this.fullWeekDay.forEach((obj, index) => {
      return obj.alltime.forEach((oob, ind) => {
        return Object.entries(oob).find(([ky, val]) => {
          if (event.type === ky) {
            return oob[ky] = event.value;
          }
        });
      });
    });
    //console.log(this.fullWeekDay);
  }

  getCurrentDate() {
    return moment().format();
  }

  Add(index) {
    let lng = index.length;
    var name1 = 'time' + lng + 1;
    var name2 = 'time' + lng + 2;
    this.collectTiems.push({ [name1]: '', [name2]: '', });
    //console.log(this.anArray);
  }

  remove(item) {
    this.collectTiems.splice(item, 1);
    //console.log(this.anArray);
  }

  save() {
    if (this.isEnableToggle) {
      this.weekday.map((item, index) => {
        const data = { "alltime": this.collectTiems };
        this.weekday[index] = Object.assign(item, data);
      });
      //console.log(this.weekday);

      /* const totalWork = [];
      this.weekday.filter((item: any, ind) => {
        if (item.isEnable) {
          let totWork = [];
          item.alltime.map((mainItem, index) => {
            let dataObje = {};
            Object.entries(mainItem).find(([ky, val]) => {
              if (ky.charAt(ky.length - 1) === "1") {
                dataObje = Object.assign(dataObje, { "startTime": val });
              } else {
                dataObje = Object.assign(dataObje, { "endTime": val });
              }
            });
            totWork.push(dataObje);
          });
          item.alltime = totWork;
          totalWork.push(item);
        }
      });
      console.log(totalWork); */

      ValidatorUtils.timeSloteObj(this.weekday).then((allObj: any) => {
        if (allObj.status) {
          ValidatorUtils.timeSloteCustomSetOnArr(this.weekday).then((result: any) => {
            if (result.status) {
              this.isCustomTiemValidArr = [];
              let validTimeArr: any = [];
              validTimeArr = result.data;
              if (validTimeArr.length != 0) {
                validTimeArr.filter((validTime: any, ind) => {
                  for (let index = 0; index < validTime.length; index++) {
                    for (let ind = index + 1; ind < validTime.length; ind++) {
                      const morStartTime = DataUtils.getValidTime(validTime[index], DataUtils.getTodayMoment());
                      const morEndTime = DataUtils.getValidTime(validTime[ind], DataUtils.getTodayMoment());

                      if (morStartTime.isValid() && morEndTime.isValid()) {
                        if (morEndTime.isSameOrBefore(morStartTime)) {
                          //console.log("isSameOrBefore");
                          this.isCustomTiemValid = false;
                        } else {
                          //console.log("is working");
                          this.isCustomTiemValid = true;
                        }
                        this.isCustomTiemValidArr.push(this.isCustomTiemValid);
                      } else {
                        //console.log("it's start time is empty");
                        this.commonService.danger("It's not a valid date or it's empty data");
                      }
                    }
                  }
                });
                //console.log(this.isCustomTiemValidArr);
                let isEnab = this.isCustomTiemValidArr.every((i) => {
                  if (i) {
                    return true;
                  }
                  return false;
                });
                //console.log(isEnab);
                if (isEnab) {
                  // It's working 
                  console.log(allObj);
                  this.onboardService.addShopWorkingTime(10, Object.assign({"workingHours":allObj.data})).subscribe((res: any) => {
                    if(res?.isShopTime.success){
                      this.storageService.setItem(Constants.WORKING_HOURS,{"workingHours":this.weekday});
                      this.router.navigate(['/kyc-form']);
                    }
                  });
                } else {
                  this.commonService.danger("The selected time slot can be equal to or earlier than that time slot");
                }
              }
            } else {
              //console.log(result);
              this.commonService.danger(result.message);
            }
          });
        } else {
          //console.log(result.message);
          this.commonService.danger(allObj.message);
        }
      });

      //console.log(totalWork);

      //console.log(Object.assign({"workingHours":totalWork}));
      /* this.onboardService.addShopWorkingTime(1,Object.assign({"workingHours":totalWork})).subscribe((res: any) => {
        if(res?.isShopTime.success){
          this.storageService.setItem(Constants.WORKING_HOURS,{"workingHours":this.weekday});
          this.router.navigate(['/kyc-form']);
        }
      }); */
    } else {
      console.log(this.fullWeekDay);
      this.customDateTime = [];

      this.customDateTime = Object.assign(this.fullWeekDay)
      //this.customDateTime.push(this.fullWeekDay);



      ValidatorUtils.timeSloteCustomObj(this.customDateTime).then((allObj: any) => {
        if (allObj.status) {
          ValidatorUtils.timeSloteCustomSetOnArr(this.customDateTime).then((result: any) => {
            if (result.status) {
              this.isCustomTiemValidArr = [];
              let validTimeArr: any = [];
              validTimeArr = result.data;
              if (validTimeArr.length != 0) {
                validTimeArr.filter((validTime: any, ind) => {
                  for (let index = 0; index < validTime.length; index++) {
                    for (let ind = index + 1; ind < validTime.length; ind++) {
                      const morStartTime = DataUtils.getValidTime(validTime[index], DataUtils.getTodayMoment());
                      const morEndTime = DataUtils.getValidTime(validTime[ind], DataUtils.getTodayMoment());

                      if (morStartTime.isValid() && morEndTime.isValid()) {
                        if (morEndTime.isSameOrBefore(morStartTime)) {
                          //console.log("isSameOrBefore");
                          this.isCustomTiemValid = false;
                        } else {
                          //console.log("is working");
                          this.isCustomTiemValid = true;
                        }
                        this.isCustomTiemValidArr.push(this.isCustomTiemValid);
                      } else {
                        //console.log("it's start time is empty");
                        this.commonService.danger("It's not a valid date or it's empty data");
                      }
                    }
                  }
                });
                console.log(this.isCustomTiemValidArr);
                let isEnab = this.isCustomTiemValidArr.every((i) => {
                  if (i) {
                    return true;
                  }
                  return false;
                });
                console.log(isEnab);
                if (isEnab) {
                  // It's working 
                  console.log(allObj.data);
                  this.onboardService.addShopWorkingTime(10, Object.assign({"workingHours":allObj.data})).subscribe((res: any) => {
                    if(res?.isShopTime.success){
                      this.storageService.setItem(Constants.WORKING_HOURS,{"workingHours":this.fullWeekDay});
                      this.router.navigate(['/kyc-form']);
                    }
                  });
                } else {
                  this.commonService.danger("The selected time slot can be equal to or earlier than that time slot");
                }
              }
            } else {
              //console.log(result.message);
              this.commonService.danger(result.message);
            }
          });
        } else {
          //console.log(result.message);
          this.commonService.danger(allObj.message);
        }
      });



      //console.log(data);

      //console.log(Object.assign({"workingHours":totalWork}));
      /* this.onboardService.addShopWorkingTime(1,Object.assign({"workingHours":totalWork})).subscribe((res: any) => {
        if(res?.isShopTime.success){
          this.storageService.setItem(Constants.WORKING_HOURS,{"workingHours":this.fullWeekDay});
          this.router.navigate(['/kyc-form']);
        }
      }); */
    }
  }


  /* for custom day wise */
  dynamicAdd(index, item) {
    let finishedValues = item.alltime.length;
    /* var name1 = 'time' + index + (finishedValues + 1);
    var name2 = 'time' + index + (finishedValues + 2);     
    this.fullWeekDay[index].alltime = [];
    this.fullWeekDay[index].alltime.push(Object.assign(item, { [name1]: '', [name2]: '', }));
    console.log(this.fullWeekDay[index]);
    this.changeDetectorRef.detectChanges();
    */
    var name1 = 'time' + item.dName + finishedValues + 1;
    var name2 = 'time' + item.dName + finishedValues + 2;
    let obj = { [name1]: '', [name2]: '' };
    item.alltime.push(obj);
    console.log(this.fullWeekDay);
  }

  /* for custom day wise */
  dynamicRemove(index, item) {
    item.alltime.pop();
    console.log(item);
  }

  skipView(){
    this.router.navigate(['/kyc-form']);
  }

  onBack(){
    this.navCtrl.back();
  }
}
