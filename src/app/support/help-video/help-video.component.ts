import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/lib/services/common.service';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-help-video',
  templateUrl: './help-video.component.html',
  styleUrls: ['./help-video.component.scss'],
})
export class HelpVideoComponent implements OnInit {
  @Input() link
  url: any;

  constructor(
    private modalCtrl: ModalController,
    public commonService: CommonService,
    private sanitizer:DomSanitizer
  ) { }

  ngOnInit() {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
   }

  dismissModal() {
    this.modalCtrl.dismiss()
  }

}
