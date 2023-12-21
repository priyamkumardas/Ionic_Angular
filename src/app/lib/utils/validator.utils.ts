import * as moment from 'moment';
import { DataUtils } from './data.utils';

export class ValidatorUtils {


  //all day same time--------------------------------
  static timeSloteObj(customDateTime) {
    return new Promise((resolve) => {
      if (customDateTime.length != 0) {
        const totalWork = [];
        customDateTime.filter((item: any, ind) => {
          if (item.isEnable) {
            let totWork = [];
            item.alltime.map((mainItem, index) => {
              let dataObje = {};
              Object.entries(mainItem).find(([ky, val]) => {
                if (val != undefined && val != null && val != "") {
                  if (ky.charAt(ky.length - 1) === "1") {
                    dataObje = Object.assign(dataObje, { "startTime": val });
                  } else {
                    dataObje = Object.assign(dataObje, { "endTime": val });
                  }
                } else {
                  resolve({ "status": false, "message": "time slot is not available" });
                }
              });
              totWork.push(dataObje);
            });
            item.alltime = totWork;
            totalWork.push(item);
          }
        });
        //console.log(totalWork);
        resolve({ "status": true, "data": totalWork, "message": "It's working" });
      } else {
        resolve({ "status": false, "message": "Not any time slot available" });
      }
    });
  }

  



  //for custom time--------------------------------
  static timeSloteCustomObj(customDateTime) {
    return new Promise((resolve) => {
      if (customDateTime.length != 0) {
        const totalWork = [];
        customDateTime.filter((item: any, ind) => {
          if (item.isEnable) {
            let totWork: any = [];
            item.alltime.map((mainItem, index) => {
              let dataObje = {};
              Object.entries(mainItem).find(([ky, val]) => {
                if (val != undefined && val != null && val != "") {
                  if (ky.charAt(ky.length - 1) === "1") {
                    dataObje = Object.assign(dataObje, { "startTime": val });
                  } else {
                    dataObje = Object.assign(dataObje, { "endTime": val });
                  }
                } else {
                  //console.log("please select day for time ===>");
                  resolve({ "status": false, "message": "time slot is not available" });
                }
              });
              totWork.push(dataObje);
            });
            totWork = Object.assign({"dName": item.dName, "isEnable": item.isEnable},{ "alltime": [totWork] });
            totalWork.push(totWork);
            resolve({ "status": true, "data": totalWork, "message": "It's working" });
          } else {
            //console.log("please select day for time ===>");
            resolve({ "status": false, "message": "Not any time slot unable please click on a day for day selection" });
          }
        });
      } else {
        //console.log("please select day for time ===>");
        resolve({ "status": false, "message": "Not any time slot available" });
      }
    });
  }

  static timeSloteCustomSetOnArr(customDateTime) {
    return new Promise((resolve) => {
      if (customDateTime.length != 0) {
        const validTimeArr: any = [];
        customDateTime.filter((item: any, ind) => {
          if (item.isEnable) {
            let totWork: any = [];
            item.alltime.map((mainItem, index) => {
              Object.entries(mainItem).find(([ky, val]) => {
                if (val != undefined && val != null && val != "") {
                  if (ky.charAt(ky.length - 1) === "1") {
                    totWork.push(val);
                  } else {
                    totWork.push(val);
                  }
                } else {
                  //console.log("please select day for time ===>");
                  resolve({ "status": false, "message": "time slot is not available" });
                }
              });
            });
            validTimeArr.push(totWork);
            resolve({ "status": true, "data": validTimeArr, "message": "It's working" });
          } else {
            //console.log("please select day for time ===>");
            resolve({ "status": false, "message": "Not any time slot unable please click on a day for day selection" });
          }
        });
      } else {
        //console.log("please select day for time ===>");
        resolve({ "status": false, "message": "Not any time slot available" });
      }
    });
  }



  /* static timeSlotValid(validTimeArr): any {
    return new Promise((resolve) => {
      if (validTimeArr.length != 0) {
        validTimeArr.filter((validTime: any, ind) => {
          for (let index = 0; index < validTime.length; index++) {
            for (let ind = index + 1; ind < validTime.length; ind++) {

              const morStartTime = DataUtils.getValidTime(validTime[index], DataUtils.getTodayMoment());
              const morEndTime = DataUtils.getValidTime(validTime[ind], DataUtils.getTodayMoment());

              if (morStartTime.isValid() && morEndTime.isValid()) {
                if (morEndTime.isSameOrBefore(morStartTime)) {
                  //console.log("isSameOrBefore");
                  resolve({ "status": false, "message": "The selected time slot can be equal to or earlier than that time slot" });
                } else {
                  //console.log("is working");
                  resolve({ "status": true, "message": "It's working" });
                }
              } else {
                //console.log("it's start time is empty");
                resolve({ "status": false, "message": "It's not a valid date or it's empty data" });
              }
            }
          }
        });
      } else {
        //console.log("please select day for time ===>");
        resolve({ "status": false, "message": "Not any time slot available" });
      }
    });
  } */
}
