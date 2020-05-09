import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment'
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsMapTypeId,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';

import { ActionSheetController, Platform, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {

  @Input() name:string;
  @Input() lat:number;
  @Input() lng:number;
  @Input() address:string;

  map: GoogleMap;
  marker: Marker;

  constructor(
    public alertController: AlertController,
    public actionCtrl: ActionSheetController,
    private platform: Platform
  ) {
  }

  ngOnInit() {
    if (this.platform.is('cordova')) {
      this.loadMap();
    }
  }

  loadMap() {
    Environment.setEnv({
      API_KEY_FOR_BROWSER_RELEASE: environment.google_maps_browser_api_key,
      API_KEY_FOR_BROWSER_DEBUG: environment.google_maps_browser_api_key
    });
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: this.lat,
          lng: this.lng
        },
        zoom: 12,
        tilt: 30
      }
    });

    let marker: Marker = this.map.addMarkerSync({
      title: this.address,
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: this.lat,
        lng: this.lng
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      //alert('clicked');
    });

  }

}
