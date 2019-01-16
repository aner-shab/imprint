import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { latLng, tileLayer, circle, polygon } from 'leaflet';

@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage implements OnInit {
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  options: any;
  layersControl: any;
  ngOnInit(){
    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 5,
      center: latLng(46.879966, -121.726909)
    };

    this.layersControl = {
      baseLayers: {
        'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
        'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      },
      overlays: {
        'Big Circle': circle([ 46.95, -122 ], { radius: 5000 }),
        'Big Square': polygon([[ 46.8, -121.55 ], [ 46.9, -121.55 ], [ 46.9, -121.7 ], [ 46.8, -121.7 ]])
      }
    };
    
  }
  ionViewDidLoad() {
  }

}
