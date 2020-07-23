import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class NotificationService {

  private notificationdata = new BehaviorSubject<any>('');
  notifydata = this.notificationdata.asObservable();
  public interval;
  constructor(private apollo: Apollo) {
      this.notify();
  }

  public notify() {
    console.log('===========Log ===========');
    try {
        this.apollo.subscribe({
            query: gql`
            subscription {
              newNotification {
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
          })
          .subscribe(({ data }) => {
            // this.todoItems = [...this.todoItems, data.Todo.node];
            this.notificationdata.next(data);
          }, (errors) => {
            console.log(errors);
           });
    } catch (error) {
        console.log(error);
    }
    // this.interval = setInterval(() => {
    //     this.notificationdata.next(0);
    // }, 1000);
  }

  public closeNotification() {
      clearInterval(this.interval);
      this.notificationdata.next('');
      // this.notificationdata.unsubscribe();
      this.notificationdata.complete();
  }

}
