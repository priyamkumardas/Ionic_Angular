import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/lib/services/user.service';
import { CommonService } from 'src/app/lib/services/common.service';

@Component({
  selector: 'app-la-user-profile',
  templateUrl: './la-user-profile.page.html',
  styleUrls: ['./la-user-profile.page.scss'],
})
export class LaUserProfilePage implements OnInit {
  user = {
    name: '',
    phone: '',
    role: '',
    image: '',
    salary: '',
    salaryType: '',
    userId: ''
  }
  phoneNumber = "";
  @Input() state;
  data: any;
  id: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public commonservice: CommonService,
    private userService: UserService,
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.route.params.subscribe(res => {
      this.id = res.id;
      this.getUserbyId(res.id);
    })
  }
      
  getUserbyId(id) {
    this.commonservice.presentLoader().then(loading => {
      loading.present()
      this.userService.getDeliveryBoyById(id).subscribe(res => {
        loading.dismiss()
        this.data = res['data'];
        console.log(this.data);
        this.user.name = this.data.userData.basicInformation.personalDetails.firstName;
        this.user.phone = this.data.userData.phone;
        this.user.role = 'Delivery Person';
        this.user.image = this.data.userData.basicInformation.personalDetails.profileImage;
        this.user.salary = this.data.deliveryData.salary;
        this.user.salaryType = this.data.deliveryData.salaryType;
        this.user.userId = this.data.deliveryData.userId;
        console.log(this.user);
      }, error => {
        this.commonservice.danger(error.error.error.message)
        loading.dismiss()
      })
    })
  }
}
