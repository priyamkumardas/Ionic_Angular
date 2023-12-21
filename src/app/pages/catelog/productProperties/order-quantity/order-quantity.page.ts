import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonService } from './../../../../lib/services/common.service';

@Component({
  selector: 'app-order-quantity',
  templateUrl: './order-quantity.page.html',
  styleUrls: ['./order-quantity.page.scss'],
})
export class OrderQuantityPage implements OnInit {
  @Input() product = {
    price: 0,
    name: '',
    image: '',
    soldBy: '',
    grading: '',
    discount: 0,
    quantity: 0,
    status: null
  };
  // quantity: any;
  amount: any;
  @Input() unit: any;
  @Input() price: any;
  showMore = false;
  rate = 10;
  solditem: any;
  selectedOption: any;

  availableQuantityGm = [{
    quantity: 0.005,
    image: '/assets/icon/kg/5-gm.svg'
  },
  {
    quantity: 0.01,
    image: '/assets/icon/kg/10-gm.svg'
  },
  {
    quantity: 0.025,
    image: '/assets/icon/kg/25-gm.svg'
  },
  {
    quantity: 0.05,
    image: '/assets/icon/kg/50-gm.svg'
  },
  {
    quantity: 0.1,
    image: '/assets/icon/kg/100-gm.svg'
  },
  {
    quantity: 0.25,
    image: '/assets/icon/kg/250-gm.svg'
  },
  {
    quantity: 0.5,
    image: '/assets/icon/kg/500-gm.svg'
  },
  {
    quantity: 0.75,
    image: '/assets/icon/kg/750-gm.svg'
  },
  ];

  availableQuantityKg = [{
    quantity: 1.5,
    image: '/assets/icon/kg/1.5-kg.svg'
  },
  {
    quantity: 2,
    image: '/assets/icon/kg/2-kg.svg'
  },
  {
    quantity: 2.5,
    image: '/assets/icon/kg/2.5-kg.svg'
  }
  ];

  availableQuantityGlass = [{
    quantity: 1,
    image: '/assets/icon/gls/gls1.svg'
  },
  {
    quantity: 2,
    image: '/assets/icon/gls/gls2.svg'
  },
  {
    quantity: 4,
    image: '/assets/icon/gls/gls4.svg'
  },
  {
    quantity: 6,
    image: '/assets/icon/gls/gls6.svg'
  },
  {
    quantity: 8,
    image: '/assets/icon/gls/gls8.svg'
  }
  ];

  availableQuantityPlt = [{
    quantity: 0.25,
    image: '/assets/icon/pcs/one-by-four-pcs.svg'
  },
  {
    quantity: 0.5,
    image: '/assets/icon/pcs/one-by-two-pcs.svg'
  },
  {
    quantity: 1,
    image: '/assets/icon/pcs/one-pcs.svg'
  },
  {
    quantity: 1.5,
    image: '/assets/icon/pcs/one-one-by-two-pcs.svg'
  },
  {
    quantity: 4,
    image: '/assets/icon/pcs/four-pcs.svg'
  },
  {
    quantity: 5,
    image: '/assets/icon/pcs/five-pcs.svg'
  },
  {
    quantity: 6,
    image: '/assets/icon/pcs/six-pcs.svg'
  },
  {
    quantity: 8,
    image: '/assets/icon/pcs/eight-pcs.svg'
  },
  {
    quantity: 10,
    image: '/assets/icon/pcs/ten-pcs.svg'
  },
  {
    quantity: 12,
    image: '/assets/icon/pcs/12-pcs.svg'
  },
  {
    quantity: 15,
    image: '/assets/icon/pcs/15-pcs.svg'
  },
  ]

  availableQuantityMl = [{
    quantity: 0.05,
    image: '/assets/icon/ltr/50-ml.svg'
  },
  {
    quantity: 0.1,
    image: '/assets/icon/ltr/100-ml.svg'
  },
  {
    quantity: 0.25,
    image: '/assets/icon/ltr/250-ml.svg'
  },
  {
    quantity: 0.5,
    image: '/assets/icon/ltr/500-ml.svg'
  },
  {
    quantity: 0.75,
    image: '/assets/icon/ltr/750-ml.svg'
  },
  ]

  availableQuantityLtr = [{
    quantity: 1.5,
    image: '/assets/icon/ltr/1.5-ltr.svg'
  },
  {
    quantity: 2,
    image: '/assets/icon/ltr/2-ltr.svg'
  },
  ]

  availableQuantityPkt = [{
    quantity: 1,
    image: '/assets/icon/Pkt/1Packet.svg'
  },
  {
    quantity: 2,
    image: '/assets/icon/Pkt/2Packet.svg'
  },
  {
    quantity: 4,
    image: '/assets/icon/Pkt/4Packet.svg'
  },
  {
    quantity: 6,
    image: '/assets/icon/Pkt/6Packet.svg'
  },
  {
    quantity: 8,
    image: '/assets/icon/Pkt/8Packet.svg'
  },
  ]

  availableQuantityPcs = [{
    quantity: 1,
    image: '/assets/icon/pcsplt/1Pieces.svg'
  },
  {
    quantity: 2,
    image: '/assets/icon/pcsplt/2Pieces.svg'
  },
  {
    quantity: 4,
    image: '/assets/icon/pcsplt/4Pieces.svg'
  },
  {
    quantity: 6,
    image: '/assets/icon/pcsplt/6Pieces.svg'
  },
  {
    quantity: 8,
    image: '/assets/icon/pcsplt/8Pieces.svg'
  },
  ]
  val: string;
  decimalCount: number;

  constructor(
    private modalCtrl: ModalController,
    public commonService: CommonService) { }

  ngOnInit() {
    // console.log(this.product);
    this.selectedOption = this.product.soldBy;
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  async saveProduct() {
    console.log(this.product)
    if ((this.solditem === 'gram') || (this.solditem === 'ml')) {
      this.product.quantity = (this.product.quantity / 1000);
    }
    console.log(this.product.quantity);
    if (this.product.quantity <= 0) {
      this.commonService.danger('The quantity cannot be less than 0');
      return this.product.quantity = 0;
    }
    if (this.decimalCount > this.val?.length) {
      this.commonService.danger('The decimal value can not be more than 3 place');
      return;
    } else {
      await this.modalCtrl.dismiss(this.product);
      return this.product.quantity;
    }

  }

  radioGroupChange(entry): void {
    if ((entry.target.value === 'ml')) {
      this.solditem = entry.target.value;
    } else if (entry.target.value === 'gram') {
      this.solditem = entry.target.value;
    } else {
      this.solditem = this.product.soldBy;
    }
    console.log(this.solditem);
    this.selectedOption = entry.target.value;
  }

  async backToQuantityPopup() {
    await this.modalCtrl.dismiss('back');
  }

  toggleMore() {
    this.showMore = !this.showMore;
  }

  setQuanity(val, unt) {
    this.showMore = false;
    this.product.quantity = val;
    this.product.soldBy = unt;
  }

  decimalQuantityValue() {
    console.log(this.product.quantity);
    console.log(parseFloat(this.product.quantity?.toFixed(2)));
    this.product.quantity = parseFloat(this.product.quantity.toFixed(2))
  }

  changePrice(type) {
    if (type === 'inc') {
      this.product.quantity = +this.product.quantity ? +this.product.quantity + 1 : 1;
    } else {
      this.product.quantity = +this.product.quantity ? +this.product.quantity - 1 : 0;
    }
  }

  checkPrice(event) {
    this.val = parseFloat(event.detail.value)?.toFixed(3)?.toString();
    this.decimalCount = parseFloat(event.detail.value)?.toString()?.length
    if (event.detail.value < 0) {
      this.commonService.danger('The value cannot be less than 0');
      return;
    }
    if (parseFloat(event.detail.value).toString().length > this.val.length) {
      this.commonService.danger('The decimal value can not be more than 3 place');
      return;
    }
  }
}
