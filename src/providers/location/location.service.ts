import { Injectable } from "@angular/core";
import { MapCoordinates } from "../models/location";
import { Subject } from "rxjs/Subject";
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class LocationService {

    constructor(private geolocation: Geolocation){
    }

    public currentLocation = new Subject<MapCoordinates>();
    
    private locationActive: boolean = false;
    private longitude: number;
    private latitude: number;
    private locationWatcher;//

    public getLocation(){
        const loc: MapCoordinates = {
            longitude: this.longitude,
            latitude: this.latitude
        };
        return loc;
    }

    public start(){
        if (this.locationActive){
            return;
        }
        this.locationActive = true;
        this.locationPolling();
    }

    public stop(){
        this.locationActive = false;
        this.locationWatcher.unsubscribe();
    }

    private setLocation(lon: number, lat: number) {
        this.longitude = lon;
        this.latitude = lat;
        const loc: MapCoordinates = {
            longitude: lon,
            latitude: lat
        };

        this.currentLocation.next(loc);
    }

    private locationPolling(){
        if (!this.locationActive) {
            return;
        }  
              
        this.locationWatcher = this.geolocation.watchPosition().subscribe(position => {
            this.setLocation(position.coords.longitude, position.coords.latitude);
        });
    }

}