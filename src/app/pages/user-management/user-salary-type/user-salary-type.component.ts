import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/lib/services/common.service';

@Component({
  selector: 'app-user-salary-type',
  templateUrl: './user-salary-type.component.html',
  styleUrls: ['./user-salary-type.component.scss'],
})
export class UserSalaryTypeComponent implements OnInit {

  @Input() active: string;


  constructor(public modelCtrl: ModalController, public commonservice: CommonService,) { }

  ngOnInit() { }

  async cancel() {
    await this.modelCtrl.dismiss('back');
  }
}
