import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public isAddEdit = false;
  public totalSelectedItems = [];
  public isLoading = true;
  public selectItemForm: FormGroup;
  public allItems = [];
  public isEditable = false;
  public isConfirmPopupOepn = false;
  public deletedItem;
  public isAlertPopupOepn = false;
  public alertMsg = '';
  public today: Date;
  constructor(private apollo: Apollo, private formBuilder: FormBuilder, private cd: ChangeDetectorRef, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.today = new Date();
    this.initCall();
  }

  /**
   * Inital Calls
   */
  public initCall() {
    this.createItemsFormData();
    this.fetchListItems();
    this.fetchItems();
  }

  /**
   * Create Profile Form Group
   */
  public createItemsFormData() {
    this.selectItemForm = this.formBuilder.group({
      itemSelectedId: ['', Validators.required],
      itemName: ['', Validators.required],
      id: ['', Validators.required],
      pickupDate: ['', Validators.required],
      category: ['', Validators.required],
      quantity: ['', Validators.required],
      pricePerKg: ['', Validators.required],
      location: ['', Validators.required],
      pickupTime: ['', Validators.required]
    });
    // this.fetchUserData();
  }

  /**
   * Fetch Item Lists
   */
  public fetchListItems() {
    this.isLoading = true;
    try {
      this.apollo.query<any>({
        query: gql`
          query {
            fetchAllSelectedItems {
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
      this.isAddEdit = true;
  }

  /**
   * Fetch List of Items
   */
  public fetchItems() {
    this.apollo.query<any>({
      query: gql`
        query {
          fetchAllItems {
            itemName
            category
            id
          }
        }
      `
    }).subscribe(({ data, loading }) => {
      if (data) {
        this.allItems = data.fetchAllItems;
      }
    });
  }

  /**
   * Select Items
   */
  public selectItems() {
    this.isLoading = true;
    const { itemName, category, id, quantity, pricePerKg, pickupDate, location, pickupTime } = this.selectItemForm.value;
    try {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation {
            selectItem(itemInput: {
              itemName: "${itemName}",
              category: "${category}",
              id: "${id}",
              quantity: "${quantity}",
              pricePerKg: "${pricePerKg}",
              pickupDate: "${this.datePipe.transform(pickupDate, 'MM-dd-yyyy')}",
              location: "${location}",
              pickupTime: "${pickupTime}"
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
            this.totalSelectedItems = [];
            if (res) {
                  this.isLoading = false;
                  this.alertMsg = 'Item Added';
                  this.isAlertPopupOepn = true;
                  this.isAddEdit = false;
                  this.totalSelectedItems = res.data.selectItem;
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

  /**
   * choose item from lists
   */

   public chooseItem(evt) {
      const idx = evt.target.value;
      const filteredArray = this.allItems.filter(item => item.id === idx);
      this.selectItemForm.patchValue({
        id: idx,
        category: filteredArray[0]?.category,
        itemName: filteredArray[0]?.itemName
      });
   }

   /**
    * Item Update/Delete opetions
    */
   public itemOpetions(opType: string, item) {
     if (opType === 'edit') {
        this.selectItemForm.patchValue({
          id: item.id,
          category: item.category,
          itemName: item.itemName,
          itemSelectedId: item.id,
          quantity: item.quantity,
          pricePerKg: item.pricePerKg,
          pickupDate: item.pickupDate,
          location: item.location,
          pickupTime: item.pickupTime
        });
        this.isAddEdit = true;
        this.selectItemForm.get('itemSelectedId').disable();
        this.isEditable = true;
     } else {
       this.deletedItem = item;
       this.isConfirmPopupOepn = true;
     }
   }

   /**
    * Update item
    */
   public updateItem() {
    this.isLoading = true;
    this.totalSelectedItems = [];
    const { itemName, category, id, quantity, pricePerKg, pickupDate, location, pickupTime } = this.selectItemForm.value;
    try {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation {
            updatetItem(itemInput: {
              itemName: "${itemName}",
              category: "${category}",
              id: "${id}",
              quantity: "${quantity}",
              pricePerKg: "${pricePerKg}",
              pickupDate: "${this.datePipe.transform(pickupDate, 'MM-dd-yyyy')}",
              location: "${location}",
              pickupTime: "${pickupTime}"
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
                  this.totalSelectedItems = res.data.updatetItem;
                  this.isAddEdit = false;
                  this.isLoading = false;
                  this.isEditable = false;
                  this.alertMsg = 'Item Updated';
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
    * Delete added items
    */
   public deleteItem() {
    this.isLoading = true;
    try {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation {
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
   * closeBtn
   */
  public closeBtn() {
    this.isAddEdit = false;
    this.isEditable = false;
    this.initCall();
  }

}
