import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-view-items',
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.css']
})
export class ViewItemsComponent implements OnInit {

  @Input() addedItem;
  @Output() sendResp: EventEmitter<any> = new EventEmitter();
  public approverStatus = 'Picked';
  public adminComment;
  public userComment;
  public isLoading = false;
  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.adminComment = this.addedItem.adminComment;
    $('#viewItemModal').modal('show');
  }

  public pickOrRequest(type) {
    if (type === 'Changed') {
      this.approverStatus = 'Changed';
    } else {
      this.approverStatus = 'Picked';
    }
    this.itemOperation();
  }

  public itemOperation() {
    try {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation Mutation{
            adminOperation(inputParams: {
              pickupStatus: "${this.approverStatus}",
              u_id: "${this.addedItem.u_id}",
              itemId: "${this.addedItem.itemId}",
              adminComment: "${this.adminComment}"
            }) {
                  status
                  message
                }
            }
          `
          }).subscribe(( res ) => {
            if (res) {
                this.isLoading = false;
                this.closeModal('added');
            }

          }, (errors) => {
            this.isLoading = false;
            console.log(errors);
          });
      } catch (err) {
        this.isLoading = false;
        console.log(err);
    }
  }
  public closeModal(evt) {
    $('#viewItemModal').modal('hide');
    this.sendResp.emit(evt);
  }

}
