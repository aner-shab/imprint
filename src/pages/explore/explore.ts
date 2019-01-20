import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { latLng, tileLayer, Map, icon, Marker, MapOptions, Layer, LayerGroup } from 'leaflet';
import { LocationService } from '../../providers/location/location.service';
import { MapCoordinates } from '../../providers/models/location';
import { compassHeading, getDistanceinKm } from '../../providers/location/geo.helper';
import { debouncer } from '../../providers/decorators/debouncer';
import 'leaflet-rotatedmarker';
import { ImprintObject } from '../../providers/models/imprint';

@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage {
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private zone: NgZone,
    private locationService: LocationService) {
  }

  userLocation: MapCoordinates;
  userMarker: Marker;
  map: Map;
  options: MapOptions;
  layers: Layer[];
  // layersControl: LayersControlEvent;

  defaultPos: MapCoordinates = {
    latitude: 46.879966,
    longitude: -121.726909
  }

  public selectedImprint: ImprintObject;

  ngOnInit(){
    this.layers = [];
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

    this.userMarker = new Marker([ this.defaultPos.latitude, this.defaultPos.longitude ]);
    this.userMarker.setIcon(icon({
          //  shadowSize: [ 20, 20 ],
          //  shadowAnchor: [ 10, 10 ],
          //  shadowUrl: 'assets/imgs/marker-icon.png',
           iconSize: [30, 30],
           iconAnchor: [15, 15],
           iconUrl: 'assets/imgs/marker-icon.png',           
          })
        );
    this.userMarker.setRotationOrigin('50% 50%');
    this.layers.push(this.userMarker);
  }
  
  ionViewDidEnter(){
    this.locationService.start();
  }
  ionViewWillLeave() {
    this.locationService.stop();
    if ('ondeviceorientationabsolute' in window) {
      removeEventListener("deviceorientationabsolute", this.handleOrientation);
    }
    else{
      removeEventListener("deviceorientation", this.handleOrientation);
    }
  }

  initialized = false;
  cooldown = false;
  onMapReady(map: Map) {
    this.map = map;    
    this.map.zoomControl.remove();
    this.map.setZoom(0); // todo set to 18
    this.locationService.currentLocation.subscribe((pos: MapCoordinates)=>{
      const newLocation = {
        latitude: pos.latitude,
        longitude: pos.longitude
      };
      if (newLocation != this.userLocation){
        if (!this.initialized){
          this.initialized = true;
          this.userLocation = newLocation;      
          this.userMarker.setLatLng(latLng(pos.latitude,pos.longitude));
        }
        else{
          if (!this.cooldown){
            this.cooldown = true;
            let startLocation = this.userLocation;
            this.userLocation = newLocation;
            this.generatePathAndMove(newLocation, startLocation);
          }
        }
        this.map.panTo(latLng(pos.latitude,pos.longitude));
      }
      
    });

    if ('ondeviceorientationabsolute' in window) {
      addEventListener("deviceorientationabsolute", function(e: DeviceOrientationEvent) {
        this.handleOrientation(e);
      }.bind(this), false);
    } 
    else if ('ondeviceorientation' in window) {
      addEventListener("deviceorientation", function(e: DeviceOrientationEvent) {
        this.handleOrientation(e);
      }.bind(this), false);
    }
    this.generateDemoImprints(); // Todo remove!
    
  }

  private generatePathAndMove(newLocation: MapCoordinates, startLocation: MapCoordinates){
     const pointsNo = 10;//100;
     const latDelta = ((newLocation.latitude - startLocation.latitude) / pointsNo);
     const lngDelta = ((newLocation.longitude - startLocation.longitude) / pointsNo);
     let positions =[];
     for (let i = 0; i < pointsNo; i++) {
        let curLat = startLocation.latitude + i * latDelta;
        let curLng = startLocation.longitude + i * lngDelta;
        positions.push({latitude: curLat, longitude: curLng});
     }
     this.move(positions);
  }

  private move(positions: MapCoordinates[], i = 0){
    if (positions[i]){
      // this.userLocation = positions[i];
      this.userMarker.setLatLng(latLng(positions[i].latitude,positions[i].longitude));
      this.map.panTo(latLng(positions[i].latitude,positions[i].longitude));      
      i++;
      setTimeout(()=>{
        this.move(positions,i);
      },50);
    }
    else{      
      this.cooldown = false;
    }
  }

  @debouncer(10)
  private handleOrientation(evt: DeviceOrientationEvent){  
    // console.log(evt.alpha);
    if (this.userMarker){      
      let heading = null;
      if(evt.alpha !== null) {
        heading = compassHeading(evt.alpha, evt.beta, evt.gamma);
        this.userMarker.setRotationAngle(heading);
      }
    }
  }

  onFocusClicked(){
    this.map.panTo(latLng(this.userLocation.latitude,this.userLocation.longitude));
    this.map.setZoom(18);
  }


  onImprintClicked(imprint: ImprintObject){
    // console.log(imprint);
    this.selectedImprint = imprint;
    
    let t = getDistanceinKm(this.userLocation, imprint.coordinates)
    console.log(t);
  }

  onOverlayClicked(){
    this.selectedImprint = null;
  }

  // Tester methods
  generateDemoImprints(){
    const jsonData = [{
      coordinates: { latitude: 10, longitude: 10},
      author: { id: 100, name: "grinch", score: 666, picture: "default.png" },
      content: { message: "Hello!", imageUrl: "defaultcontent.png", score: 100, votedBefore: false },

    }]

    let imprintsLayer = [];
    let imprintsData = [];
    for (let marker of jsonData){
      const imprint = new ImprintObject(marker);
      imprintsData.push(imprint);
      imprint.marker.on('click',()=> this.zone.run(()=>this.onImprintClicked(imprint)));
      imprintsLayer.push(imprint.marker);
    } 
    this.layers.push(new LayerGroup(imprintsLayer));
  }
}
