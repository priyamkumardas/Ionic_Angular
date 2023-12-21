import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from '../../../lib/services/common.service';
import { AuthService } from '../../../lib/services/auth.service';
import { Router } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { StorageService } from 'src/app/lib/services/storage.service';
@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
  managerPhone: any;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    public commonservice: CommonService,
    public authservice: AuthService,
    private inAppBrowser: InAppBrowser,
    private storageService: StorageService,
    private platform: Platform
  ) { }

  ngOnInit() {
  }
  
  openBrowser(url){
    this.inAppBrowser.create(url, '_system');
  }

  ionViewWillEnter() {
      this.managerPhone = this.storageService.getItem('Mobile');   
  }
}
