import { MapCoordinates } from "./location";
import { UserProfile } from "./profile";
import { Marker, icon } from "leaflet";

export interface ImprintContent{
    message: string;
    imageUrl: string;
    score: number;    
    votedBefore: number;
}

export class ImprintObject{

    // Part of json data:
    public coordinates: MapCoordinates;
    public author: UserProfile;
    public content: ImprintContent;

    // not part of json data:
    public marker: Marker;
    public seenBefore: boolean;
    public visible: boolean;

    // privates
    private icon: string;

    constructor(data: any){
        Object.assign(this, data);
        this.marker = new Marker([this.coordinates.latitude,this.coordinates.longitude])

        this.checkIfImprintSeenBefore();
        this.setMarkerIcon();
    }

    setMarkerIcon(){
        this.icon = this.seenBefore ? 'assets/imgs/marker-shadow.png' : 'assets/imgs/layers.png';
        this.marker.setIcon(icon({
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        iconUrl: this.icon}));    
    }

    checkIfImprintSeenBefore(){ 
        this.seenBefore = false;
    }

}