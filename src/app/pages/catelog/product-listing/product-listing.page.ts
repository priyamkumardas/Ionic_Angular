import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.page.html',
  styleUrls: ['./product-listing.page.scss'],
})
export class ProductListingPage implements OnInit {
  fruits = [
    {p:'Passion Fruit'},
    {p:'Dragon Fruit'}
  ];
  tropicals = [
    {p:'Jack Fruit',
     pr: '120/',
     t: 'pcs'
    },
    {p:'Lychee',
     pr: '30/',
     t: 'kg'
    }
  ];
  drupes = [
    {p:'Peach',
     pr : '120/',
     t: 'pcs'
    },
    {p:'Mango',
     pr: '30/',
     t: 'kg'
    }
  ];

  selectTabs = 'Fruits';

  constructor() { }

  ngOnInit() {
  }

}
