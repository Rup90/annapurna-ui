import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-added-items',
  templateUrl: './added-items.component.html',
  styleUrls: ['./added-items.component.css']
})
export class AddedItemsComponent implements OnInit {

  public allAddedItemsByFarmer = [];
  public isLoading = true;
  public filter = 'Pending';
  public isModalOpen = false;
  public addedItem = [];
  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.fetchAllAddedItemsByFarmer();
  }

  public fetchAllAddedItemsByFarmer() {
    this.isLoading = true;
    try {
      this.apollo.query<any>({
        query: gql`
          query Query{
            userAddedProducts(filteredBy: "${this.filter}") {
              ... on UserAddedProductsDetails {
                  statusCode
                  products {
                    id
                    itemName
                    category
                    quantity
                    pricePerKg
                    pickupDate
                    location
                    pickupTime
                    pickupStatus
                    u_id
                    userComment
                    adminComment
                    user_firstName
                    user_lastName
                    productId
                  }
              }
            }
          }
          `
          }).subscribe(( res ) => {
            const { statusCode, products } = res.data.userAddedProducts;
            this.allAddedItemsByFarmer = [];
            if (statusCode === 200) {
              this.allAddedItemsByFarmer = products;
              this.isLoading = false;
            }
          }, (errors) => {
            this.isLoading = false;
            console.log(errors);
          });
    } catch (err) {
      this.isLoading = false;
    }
  }

  public chooseItem(evt) {
    this.filter = evt.target.value;
    this.fetchAllAddedItemsByFarmer();
  }

  public itemOpetions(item) {
    this.addedItem = item;
    this.isModalOpen = true;
  }

  public closeModalEvent(evt) {
    this.isModalOpen = false;
    this.addedItem = [];
    if (evt !== 'Close') {
      this.fetchAllAddedItemsByFarmer();
    }
  }

}
