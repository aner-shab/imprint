import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { latLng, tileLayer, Map, icon, Marker } from 'leaflet';
import { LocationService } from '../../providers/location/location.service';
import { MapCoordinates } from '../../providers/models/location';
import { compassHeading } from '../../providers/location/compass.helper';
import { debouncer } from '../../providers/decorators/debouncer';
import 'leaflet-rotatedmarker';

@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage {
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
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
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
        maxNativeZoom: 18,  
        maxZoom: 20 })
      ],
      zoom: 5,
      center: latLng(this.defaultPos.latitude, this.defaultPos.longitude),
      attributionControl: false      
    };

    this.layers = [];
    this.userLocationLayer = new Marker([ this.defaultPos.latitude, this.defaultPos.longitude ]);
    this.userLocationLayer.setIcon(icon({
          //  shadowSize: [ 20, 20 ],
          //  shadowAnchor: [ 10, 10 ],
          //  shadowUrl: 'assets/imgs/marker-icon.png',
           iconSize: [30, 30],
           iconAnchor: [15, 15],
           iconUrl: 'assets/imgs/marker-icon.png',
          })
        );
    this.userLocationLayer.setRotationOrigin('50% 50%');
    this.layers.push(this.userLocationLayer);
  }
  
  ionViewDidEnter(){
    this.locationService.start();
  }
  ionViewWillLeave() {
    this.locationService.stop();
    window.removeEventListener("deviceorientation", this.handleOrientation);
  }
  
  onMapReady(map: Map) {
    this.map = map;    
    this.map.zoomControl.remove();
    this.map.setZoom(18);
    this.locationService.currentLocation.subscribe((pos: MapCoordinates)=>{
      const newLocation = {
        latitude: pos.latitude,
        longitude: pos.longitude
      };
      if (newLocation != this.userLocation){
        this.userLocation = newLocation;
        this.map.panTo(latLng(pos.latitude,pos.longitude));
        this.userLocationLayer.setLatLng(latLng(pos.latitude,pos.longitude));      
      }
    });

    if ('ondeviceorientationabsolute' in window) {
      // We can listen for the new deviceorientationabsolute event.
      addEventListener("deviceorientationabsolute", function(e) {
        this.handleOrientation(e);
      }.bind(this), false);
    } 
    else if ('ondeviceorientation' in window) {
      // We can still listen for deviceorientation events.
      // The `absolute` property of the event tells us whether
      // or not the degrees are absolute.
      addEventListener("deviceorientation", function(e) {
        this.handleOrientation(e);
      }.bind(this), false);
    }
    
  }

  // @HostListener('deviceorientation',['$event'])
  @debouncer(50)
  handleOrientation(evt: DeviceOrientationEvent){  
    console.log(evt.alpha);
    if (this.userLocationLayer){      
      let heading = null;
      if(evt.alpha !== null) {
        heading = compassHeading(evt.alpha, evt.beta, evt.gamma);
        this.userLocationLayer.setRotationAngle(heading);
      }
    }
    else console.log("Nope");
  }
  

}
