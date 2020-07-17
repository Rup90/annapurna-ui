import { Component, OnInit, Output, EventEmitter } from '@angular/core';


declare var $: any;
@Component({
    selector: 'app-confirm-popup',
    templateUrl: './confirm-popup.component.html',
    styleUrls: ['./confirm-popup.component.scss']
})
 export class ConfirmPopupComponent implements OnInit {


    @Output() eventHandler: EventEmitter<any> = new EventEmitter();
    constructor() { }

    /**
     * Open Modal, When Component get loaded
     */
    ngOnInit() {
        $('#confirmPopUp').modal('show');
    }

    /**
     * Handle event, either modal needs to close or continue
     */
    public modalEventHandler(evt) {
        $('#confirmPopUp').modal('hide');
        this.eventHandler.emit(evt);
    }
 }
