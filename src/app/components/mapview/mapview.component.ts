import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GoogleMap } from '@capacitor/google-maps'
import { environment } from 'src/environments/environment';
declare let L;

@Component({
  selector: 'app-mapview',
  templateUrl: './mapview.component.html',
  styleUrls: ['./mapview.component.scss'],
})
export class MapviewComponent implements OnInit, OnChanges, OnDestroy {

  map: any;
  marker;
  @Input() isMarkerMoveable = true;
  @Input() latlng;
  @Input() customeclass;
  @Input() height = 100;
  @Output() locationChange = new EventEmitter();
  @ViewChild('map') mapRef: ElementRef<HTMLElement>;
  markerId: any;
  newMap: any;


  constructor(public platform: Platform) { }

  async ngOnInit() { }

  async ngOnDestroy() {
    await this.newMap.destroy();
  }

  async ionViewWillEnter() {
    console.log(this.mapRef);
    const apiKey = environment.gMaps.apiKey;
    const mapRef = document.getElementById('map');
    if (this.markerId != null) {
      await this.newMap.removeMarker(this.markerId);
    }
    if (this.newMap) {
      await this.newMap.destroy();
    }

    //initializing google Maps
    this.newMap = await GoogleMap.create({
      id: 'my-cool-map',
      element: this.mapRef.nativeElement, // reference to the capacitor-google-map element
      apiKey: apiKey, // Your Google Maps API Key
      config: {
        center: {
          // The initial position to be rendered by the map
          lat: parseFloat(this.latlng.lat),
          lng: parseFloat(this.latlng.lng),
        },
        zoom: 20, // The initial zoom level to be rendered by the map
      },
    });

    this.markerId = await this.newMap.addMarker({
      coordinate: {
        lat: parseFloat(this.latlng.lat),
        lng: parseFloat(this.latlng.lng),
      },
      draggable: true,
    });

    // await this.newMap.setCamera({
    //   coordinate: {
    //     lat: parseFloat(this.latlng.lat),
    //     lng: parseFloat(this.latlng.lng),
    //   },
    //   animate: true,
    //   animationDuration: 12000,
    // });

    this.newMap.setOnMarkerDragEndListener(async (data) => {
      this.marker = data;
      console.log(data);
      this.getDecodedAddress();
    });

    // this.newMap.setOnMapClickListener(async (data) => {
    //   console.log(data);
    //   // await this.newMap.removeMarkers(this.markerId);
    //   this.markerId = await this.newMap.addMarker({
    //     coordinate: {
    //       lat: parseFloat(data.latitude),
    //       lng: parseFloat(data.longitude)
    //     },
    //     draggable: true
    //   });
    //   this.latlng = {
    //     lat: parseFloat(data.latitude),
    //     lon: parseFloat(data.longitude),
    //     lng: parseFloat(data.longitude)
    //   }
    //   console.log(this.latlng , 'this.latlng')
    //   this.locationChange.emit(this.latlng)
    // })
  }

  ngOnChanges(ev) {
    console.log(1)
    if (ev.latlng) {
      setTimeout(() => {
        this.latlng.lat = ev.latlng.currentValue.lat;
        this.latlng.lon = ev.latlng.currentValue.lng;
        this.ionViewWillEnter();
      }, 1000);
    }
  }

  getDecodedAddress(isFirst = false) {
    this.latlng = {
      lat: isFirst ? this.latlng.lat : this.marker.latitude,
      lon: isFirst ? this.latlng.lon : this.marker.longitude
    }
    this.locationChange.emit(this.latlng)
  }

  async openLocation(place) {
    const lat = place.lat;
    const lng = place.lng;
  }
}

