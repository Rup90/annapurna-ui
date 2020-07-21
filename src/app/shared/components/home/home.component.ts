import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
  constructor(private apollo: Apollo, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
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
      category: ['', Validators.required],
      quantity: ['', Validators.required],
      pricePerKg: ['', Validators.required]
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
            }
          }
          `
          }).subscribe(( res ) => {
            console.log('>>>>>>>>', res);
            this.totalSelectedItems = [];
            if (res.data.fetchAllSelectedItems) {
              this.totalSelectedItems = res.data.fetchAllSelectedItems;
              this.isLoading = false;
              this.cd.detectChanges();
            }
          }, (errors) => {
            this.isLoading = false;
            console.log(errors);
            alert('Something is wrong');
          });
    } catch (err) {
      this.isLoading = false;
      console.log(err);
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
    const { itemName, category, id, quantity, pricePerKg } = this.selectItemForm.value;
    try {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation {
            selectItem(itemInput: {
              itemName: "${itemName}",
              category: "${category}",
              id: "${id}",
              quantity: "${quantity}",
              pricePerKg: "${pricePerKg}"
            }) {
                  itemName
                  category
                  id
                  quantity
                  pricePerKg
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
           console.log(errors);
          });
      } catch (err) {

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
          pricePerKg: item.pricePerKg
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
    const { itemName, category, id, quantity, pricePerKg } = this.selectItemForm.value;
    try {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation {
            updatetItem(itemInput: {
              itemName: "${itemName}",
              category: "${category}",
              id: "${id}",
              quantity: "${quantity}",
              pricePerKg: "${pricePerKg}"
            }) {
                  itemName
                  category
                  id
                  quantity
                  pricePerKg
                }
            }
          `
          }).subscribe(( res ) => {
            console.log(res.data);
            if (res) {
                  this.totalSelectedItems = res.data.updatetItem;
                  this.isAddEdit = false;
                  this.isLoading = false;
                  this.isEditable = false;
                  this.alertMsg = 'Item Updated';
                  this.isAlertPopupOepn = true;
            }

          }, (errors) => {
           console.log(errors);
          });
      } catch (err) {

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
                }
            }
          `
          }).subscribe(( res ) => {
            console.log(res.data);
            if (res) {
                this.totalSelectedItems = res.data.deletetItem;
                this.isLoading = false;
                this.isAddEdit = false;
                this.alertMsg = 'Item Deleted';
                this.isAlertPopupOepn = true;
            }

          }, (errors) => {
           console.log(errors);
          });
      } catch (err) {
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
      console.log(evt);
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
