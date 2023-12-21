import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FilterModalComponent } from 'src/app/components/filter-modal/filter-modal.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.page.html',
  styleUrls: ['./employee-list.page.scss'],
})
export class EmployeeListPage implements OnInit {
  employees = [
    {
      n : 'Swathi Balaji',
      r : 'Inventory Manager,...'
    },
    {
      n : 'Kishore',
      r : 'Sales Manager, Order...'
    },
    {
      n : 'Meha',
      r : 'Procurement Manager'
    },
    {
      n : 'Mithun',
      r : 'Delivery Manager'
    }
  ];
  constructor(private modalctrl: ModalController) { }

  async openModal() {
    const modal = await this.modalctrl.create({
      component : FilterModalComponent,
      cssClass: 'filter-modal-css'
    });

    await modal.present();
  };

  ngOnInit() {
  }

}
