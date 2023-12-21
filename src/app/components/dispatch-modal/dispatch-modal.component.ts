import { Component, OnInit, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { OrderPageModule } from 'src/app/pages/order/order/order.module';
import { OrderService } from 'src/app/lib/services/order.service';
import { CommonService } from 'src/app/lib/services/common.service';

@Component({
  selector: 'app-dispatch-modal',
  templateUrl: './dispatch-modal.component.html',
  styleUrls: ['./dispatch-modal.component.scss'],
})
export class DispatchModalComponent implements OnInit {
  @Input() orderItem
  @Input() isReDispatch
  segment: any = '0';
  deliveryBoyList: any = [];
  deliveryBoyDetile: any = [];
  freelancer: any;
  associated: any;
  self: any;
  searchAssociated: string;
  searchFreelance: string;
  filteredAssociated: any;
  filteredFreelanced: any
  constructor(private modalCtrl: ModalController, public commonService: CommonService, private orderService: OrderService,
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.getDeliveryBoyList()
  }

  segmentChanged(ev: any) {
    this.segment = '0';
  }

  action() {
    return this.modalCtrl.dismiss();
  }
  searchDeliveryBoyAssociated() {
    let tempdata = this.associated;
    if (this.associated) {
      if (this.searchAssociated != '') {
        this.filteredAssociated = tempdata.filter(res => (res?.name.toLowerCase()).includes(this.searchAssociated.toLowerCase()) || (res?.phone).includes(this.searchAssociated))
      }
    }
  }
  searchDeliveryBoyfreelance() {
    let tempdataF = this.freelancer;
    // console.log(tempdata)
    if (this.freelancer) {
      if (this.searchFreelance != '') {
        this.filteredFreelanced = tempdataF.filter(res => (res?.name.toLowerCase()).includes(this.searchFreelance.toLowerCase()) || (res?.phone).includes(this.searchFreelance))
      }
    }
  }
  getDeliveryBoyList() {
    this.commonService.presentLoader().then(presentLoading => {
      presentLoading.present()
      this.orderService.getDelBoyList().subscribe(res => {
        presentLoading.dismiss();
        console.log(res)
        this.associated = res['data'].associated
        this.freelancer = res['data'].freelancer
        this.self = res['data'].self
        // console.log(this.self);
        // console.log(this.freelancer);
        // console.log(this.associated);
      }, error => {
        presentLoading.dismiss();
        console.log(error)
      })
    })
  }

  async selectFreelancer(freelancerId) {
    let assignOrder = {
      deliveryBoyID: freelancerId
    }
    if (this.isReDispatch) {
      this.orderService.selectReDeliveryBoy(this.orderItem.orderID, assignOrder).subscribe((order: any) => {
        console.log(order)
        order?.data?.data ? this.commonService.success(order.data.data) : this.commonService.success(order.data.message);
      })
    } else {
      this.orderService.selectDeliveryBoy(this.orderItem.orderID, assignOrder).subscribe((order: any) => {
        console.log(order)
        this.commonService.success('Order assigned successfully!');
      })
    }
    await this.modalCtrl.dismiss(freelancerId);
  }

  async selectAssociated(associateId) {
    let assignOrder = {
      deliveryBoyID: associateId
    }
    if (this.isReDispatch) {
      this.orderService.selectReDeliveryBoy(this.orderItem.orderID, assignOrder).subscribe((order: any) => {
        console.log(order)
        order?.data?.data ? this.commonService.success(order.data.data) : this.commonService.success(order.data.message);
      })
    } else {
      this.orderService.selectDeliveryBoy(this.orderItem.orderID, assignOrder).subscribe((order: any) => {
        console.log(order)
        order?.data?.data ? this.commonService.success(order?.data?.data) : this.commonService.success('Order assigned successfully!');
      })
    }
    await this.modalCtrl.dismiss(associateId);
  }
}
