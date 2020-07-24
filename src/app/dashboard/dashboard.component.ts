import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import { NotificationService } from '../shared/dataservices/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public isAddEdit = false;
  public totalSelectedItems = [];
  public isLoading = true;
  public allItems = [];
  public isEditable = false;
  public isConfirmPopupOepn = false;
  public deletedItem;
  public isAlertPopupOepn = false;
  public alertMsg = '';
  public itemData: [];
  constructor(private apollo: Apollo, private cd: ChangeDetectorRef, private datePipe: DatePipe, public notifyServ: NotificationService) { }

  ngOnInit(): void {
    this.notifyServ.notifydata.subscribe(res => {
      console.log('res -->', res);
    })
    this.initCall();
  }

  /**
   * Inital Calls
   */
  public initCall() {
    this.fetchListItems();
  }


  /**
   * Fetch Item Lists
   */
  public fetchListItems() {
    this.isLoading = true;
    try {
      this.apollo.query<any>({
        query: gql`
          query Query{
            fetchAllSelectedItems {
              itemName
              category
              id
              quantity
              pricePerKg
              pickupDate
              location
              pickupTime
              pickupStatus
              userComment
              adminComment
            }
          }
          `
          }).subscribe(( res ) => {
            this.totalSelectedItems = [];
            if (res.data.fetchAllSelectedItems) {
              this.totalSelectedItems = res.data.fetchAllSelectedItems;
              this.isLoading = false;
              this.cd.detectChanges();
            }
          }, (errors) => {
            this.isLoading = false;
            alert('Something is wrong');
          });
    } catch (err) {
      this.isLoading = false;
    }
  }

  /**
   * Add items
   */
  public addItems() {
      this.itemData = [];
      this.isAddEdit = true;
  }

   /**
    * Item Update/Delete opetions
    */
   public itemOpetions(opType: string, item) {
     if (opType === 'edit') {
        this.itemData = item;
        this.isAddEdit = true;
     } else {
       this.deletedItem = item;
       this.isConfirmPopupOepn = true;
     }
   }


   /**
    * Delete added items
    */
   public deleteItem() {
    this.isLoading = true;
    try {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation Mutation{
            deletetItem(itemInput: {
              itemName: "${this.deletedItem.itemName}",
              id: "${this.deletedItem.id}"
            }) {
                  itemName
                  category
                  id
                  quantity
                  pricePerKg
                  pickupDate
                  location
                  pickupTime
                }
            }
          `
          }).subscribe(( res ) => {
            if (res) {
                this.totalSelectedItems = res.data.deletetItem;
                this.isLoading = false;
                this.isAddEdit = false;
                this.alertMsg = 'Item Deleted';
                this.isAlertPopupOepn = true;
            }

          }, (errors) => {
            this.isLoading = false;
            console.log(errors);
          });
      } catch (err) {
        this.isLoading = false;
    }
   }

  /**
   * Get Confirmation before delete
   */
  public getPopupEvent(evt) {
    this.isConfirmPopupOepn = false;
    if (evt === 'yes') {
      this.deleteItem();
    } else {
      this.deletedItem = '';
    }
  }

  /**
   * Alert Event
   */
  public getAlertEvent(evt) {
    if (evt) {
      this.isAlertPopupOepn = false;
      this.alertMsg = '';
    }
  }


  /**
   * Close Add Edit modal
   */
  public closeAddEditModal(evt) {
    this.isAddEdit = false;
    this.itemData = [];
    if (evt !== 'Close') {
      this.initCall();
    }
  }

}
