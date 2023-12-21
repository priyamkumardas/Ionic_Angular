import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomController } from '@ionic/angular';
import { Constants } from 'src/app/config/constants';
import { LanguageService } from 'src/app/lib/services/language.service';
import { StorageService } from 'src/app/lib/services/storage.service';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/lib/services/common.service';

@Component({
  selector: 'app-selected-language',
  templateUrl: './selected-language.page.html',
  styleUrls: ['./selected-language.page.scss'],
})
export class SelectedLanguagePage implements OnInit {
  localLanguage: any;
  allLanguageData;
  allLanguage: any[];
  searchLang;
  SelectedLan;
  helpVideo: any;

  constructor(
    public router: Router,
    private storageservice: StorageService,
    private languageService: LanguageService,
    private location: Location,
    private commonService: CommonService,
  ) { }

  ngOnInit() {
    this.commonService.presentLoader().then(loading => {
      loading.present()
      this.languageService.getAllLanguagesSplashApi().subscribe((res: any) => {
        loading.dismiss()
        if (res?.success && res?.data?.language_meta) {
          console.log(res?.data.language_meta);
          this.allLanguage = res?.data.language_meta;
          this.allLanguageData = this.allLanguage;
          this.localLanguage = this.storageservice.getItem(Constants.SELECT_LANGUAGES);
          if (this.localLanguage) {
            this.SelectedLan = this.localLanguage.text;
          } else {
            this.selectLanguage(this.allLanguage[0])
          }
        }
      }, err => {
        this.commonService.toast(err.error.error.message);
        loading.dismiss()
      });
    })
  }

  searchFunction() {
    this.allLanguage = this.allLanguageData.filter((lang) => {
      if (lang.text.toLowerCase().includes(this.searchLang.toLowerCase())) {
        return lang;
      }
    });
  }
  selectLang() {
    if (this.storageservice.getItem(Constants.SELECT_LANGUAGES)) {
      if (this.storageservice.getItem(Constants.AUTH_TOKEN)) {
        this.location.back()
      } else {
        this.router.navigate(['/login'])
      }
    }
  }

  selectLanguage(item) {
    if (item) {
      //for (let i in this.styleArray) this.styleArray[i] = false;
      this.SelectedLan = item.text;
      this.languageService
        .selectLanguageCDN(item.url)
        .subscribe((lngData: any) => {
          console.log(lngData);
          if (lngData && lngData?.System) {
            //console.log(lngData.selectLanguage?.system);
            //this.allLanguage = languages?.allLanguage?.data.language_meta;
            localStorage.setItem(
              Constants.SELECT_LANGUAGES,
              btoa(escape(JSON.stringify(item)))
            );
            localStorage.setItem(
              Constants.ALL_LANGUAGES,
              btoa(escape(JSON.stringify(lngData?.System)))
            );
          }
        });
    }
    /*  if (localStorage.getItem(Constants.ALL_LANGUAGES)) {
      const data = JSON.parse(unescape(atob(localStorage.getItem(Constants.ALL_LANGUAGES))));
      console.log(data);
    } */
  }

  async openHelpVideo() {
    this.helpVideo = this.storageservice.getItem(Constants.HELP_VIDEOS);
    this.commonService.openHelpVideo(this.helpVideo.Onboarding)
   }
}
