import { Component, Input } from "@angular/core";
import { ImprintObject } from "../../../providers/models/imprint";

@Component({
    selector: 'imprint-modal',
    templateUrl: 'imprint-modal.component.html',
	// styleUrls: ['imprint-modal.component.scss']
  })
  export class ImprintModalComponent {
    
    @Input() imprint: ImprintObject;

    constructor() {
        console.log(this.imprint);
    }

}