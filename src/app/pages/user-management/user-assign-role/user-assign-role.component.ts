import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from 'src/app/lib/services/common.service';

@Component({
  selector: 'app-user-assign-role',
  templateUrl: './user-assign-role.component.html',
  styleUrls: ['./user-assign-role.component.scss'],
})
export class UserAssignRoleComponent implements OnInit {
  @Input() active: string;

  constructor(public modelCtrl: ModalController,
    public commonservice: CommonService,
  ) { }

  ngOnInit() { }

  async cancel() {
    await this.modelCtrl.dismiss('back');
  }
}
