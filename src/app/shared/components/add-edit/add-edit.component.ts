import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
declare var $: any;

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {

  @Output() closeAddEditModal: EventEmitter<any> = new EventEmitter();
  @Input() addEditModalData;
  public title = 'EDIT ITEM';
  public isEditable = true;
  public selectItemForm: FormGroup;
  public allItems = [];
  public isLoading = false;
  public today: Date;
  constructor(private formBuilder: FormBuilder, private apollo: Apollo, private datePipe: DatePipe) { }

  ngOnInit(): void {
    console.log('addEditModalData', this.addEditModalData);
    this.today = new Date();
    if (this.addEditModalData.length === 0) {
      this.title = 'ADD NEW ITEM';
      this.isEditable = false;
    }
    this.initCall();
  }

  public initCall() {
    this.fetchItems();
    this.createItemsFormData();
    $('#addEditModal').modal('show');
  }

  /**
   * Fetch List of Items
   */
  public fetchItems() {
    this.apollo.query<any>({
      query: gql`
        query Query{
          fetchAllProducts {
            ... on ProductDetails {
              statusCode
              products {
                itemName
                category
                id
              }
            }
          }
        }
      `
    }).subscribe(({ data, loading }) => {
      const { statusCode, products} = data.fetchAllProducts;
      if (statusCode === 200) {
        this.allItems = products;
      }
    });
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
      pickupTime: ['', Validators.required],
      adminComment: [''],
      userComment: [''],
    });
    console.log('>>>>>>', this.isEditable);
    if (this.isEditable) {
      this.patchValue(this.addEditModalData);
    }
  }


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
   * Select Items
   */
  public addNewItems() {
    this.isLoading = true;
    const { itemName, category, id, quantity, pricePerKg, pickupDate, location, pickupTime } = this.selectItemForm.value;
    try {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation Mutation{
            saveProduct(itemDetails: {
              itemName: "${itemName}",
              category: "${category}",
              productId: "${id}",
              quantity: "${quantity}",
              pricePerKg: "${pricePerKg}",
              pickupDate: "${this.datePipe.transform(pickupDate, 'MM-dd-yyyy')}",
              location: "${location}",
              pickupTime: "${pickupTime}"
            }) {

                ... on ProductSaveResponse {
                  statusCode
                  response
                }
              }
            }
          `
          }).subscribe(( res ) => {
            console.log(res);
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

  public updateItem() {
    this.isLoading = true;
    const { itemName, category, id, quantity, pricePerKg, pickupDate, location, pickupTime,
      adminComment, userComment} = this.selectItemForm.value;
    try {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation Mutation{
            updatetItem(itemInput: {
              itemName: "${itemName}",
              category: "${category}",
              id: "${id}",
              quantity: "${quantity}",
              pricePerKg: "${pricePerKg}",
              pickupDate: "${this.datePipe.transform(pickupDate, 'MM-dd-yyyy')}",
              location: "${location}",
              pickupTime: "${pickupTime}"
              adminComment: "${pickupTime}",
              userComment: "${userComment}",
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
                this.isLoading = false;
                this.closeModal('update');
            }

          }, (errors) => {
            this.isLoading = false;
            console.log(errors);
          });
      } catch (err) {
        this.isLoading = false;
    }
  }

  public patchValue(item) {
    this.selectItemForm.patchValue({
      id: item.id,
      category: item.category,
      itemName: item.itemName,
      itemSelectedId: item.id,
      quantity: item.quantity,
      pricePerKg: item.pricePerKg,
      pickupDate: item.pickupDate,
      location: item.location,
      pickupTime: item.pickupTime,
      adminComment: item?.adminComment,
      userComment: item?.userComment
    });
    this.selectItemForm.get('itemSelectedId').disable();
  }

  public closeModal(evtType) {
    $('#addEditModal').modal('hide');
    this.closeAddEditModal.emit(evtType);
  }

}
