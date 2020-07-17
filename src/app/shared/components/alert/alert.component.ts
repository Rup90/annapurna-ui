import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-alert-popup',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss']
})
 export class AlertPopupComponent implements OnInit {


    @Input() message;
    @Output() emitEvent: EventEmitter<any> = new EventEmitter();
    constructor() { }

    /**
     * Open Modal, When Component get loaded
     */
    ngOnInit() {
        $('#alertPopUp').modal('show');
    }

    /**
     * Handle event, either modal needs to close or continue
     */
    public modalEventHandler(evt) {
        $('#alertPopUp').modal('hide');
        this.emitEvent.emit(evt);
    }
 }
