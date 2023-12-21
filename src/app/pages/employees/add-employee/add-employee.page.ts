import { Component, OnInit } from '@angular/core';
import { PhotoService } from 'src/app/lib/services/photo.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {
  src = 'https://www.holidify.com/images/bgImages/AHMEDABAD.jpg';

  employeeProfileURL:string;

  segment;
  categories = [
    'seosonal',
    'ripen',
    'tropical',
    'grimm',
    'seosonal',
    'ripen',
    'tropical',
    'grimm',
    'ripen',
    'tropical',
    'grimm',
  ];
  constructor(private photoService: PhotoService) {}

  ngOnInit() {
    this.segment = '0';
  }

  addPhotoToGallery(source){
    this.photoService.takePhoto(source).then((img) => {
     this.employeeProfileURL = img;
    });   
   }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

}
