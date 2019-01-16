import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { latLng, tileLayer, Map, marker, icon, Marker } from 'leaflet';
import { LocationService } from '../../providers/location/location.service';
import { MapCoordinates } from '../../providers/models/location';

@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage {
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private locationService: LocationService) {
  }

  userLocation: MapCoordinates;
  map: Map;
  options: any;
  layers: any;
  layersControl: any;
  userLocationLayer: Marker;

  defaultPos: MapCoordinates = {
    latitude: 46.879966,
    longitude: -121.726909
  }

  ngOnInit(){
    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
      ],
      zoom: 5,
      center: latLng(this.defaultPos.latitude, this.defaultPos.longitude),
      attributionControl: false
    };

    this.layersControl = {
      attribution: false,
      baseLayers: {
        'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }),
        'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/{z}/{x}/{y}.png', { maxZoom: 18 })
      }
    };

    this.layers = [];
    this.userLocationLayer = marker([ this.defaultPos.latitude, this.defaultPos.longitude ], {
      icon: icon({
         iconSize: [ 20, 20 ],
         iconAnchor: [ 10, 10 ],
         iconUrl: 'assets/imgs/marker-icon.png'
      })
    });
    this.layers.push(this.userLocationLayer);
    
  }
  
  onMapReady(map: Map) {
    this.map = map;    
    // this.map.addControl(
    //     control.attribution({
    //         prefix: ''
    //     })
    // );
    this.locationService.currentLocation.subscribe((pos: MapCoordinates)=>{
      this.userLocation = {
        latitude: pos.latitude,
        longitude: pos.longitude
      };
      this.map.panTo(latLng(pos.latitude,pos.longitude));
      this.map.setZoom(18);
      this.userLocationLayer.setLatLng(latLng(pos.latitude,pos.longitude));
    })
  }

  ionViewWillLeave() {
    this.locationService.stop();
  }
  ionViewDidEnter(){
    this.locationService.start();
  }
  

}
