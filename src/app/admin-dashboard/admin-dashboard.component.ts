import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  public allItems = [];
  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.fetchItems();
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
        console.log(this.allItems);
      }
    });
  }

}
