import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-admin-notification',
  templateUrl: './admin-notification.component.html',
  styleUrls: ['./admin-notification.component.css']
})
export class AdminNotificationComponent implements OnInit {

  public allNotifications = [];
  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.initCall();
  }

  public initCall() {
    try {
      this.apollo.query<any>({
        query: gql`
          query {
            fetchNotifications {
              ... on NotificationDetails {
                statusCode
                notifications {
                    itemName
                    user_id
                    user_firstName
                    user_lastName
                    productId
                }
              }
            }
          }
        `
      }).subscribe(({ data, loading }) => {
        const { statusCode, notifications} = data.fetchNotifications;
        if (statusCode === 200) {
          this.allNotifications = notifications;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

}
