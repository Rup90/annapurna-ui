import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../shared/dataservices/notification.service';

@Component({
  selector: 'app-admin-notification',
  templateUrl: './admin-notification.component.html',
  styleUrls: ['./admin-notification.component.css']
})
export class AdminNotificationComponent implements OnInit {

  public notification;
  constructor(public notifyServ: NotificationService) { }

  ngOnInit(): void {
    this.notifyServ.notifydata.subscribe(res => {
      console.log('res -->', res);
      if (res) {
        this.notification = res.itemAdded;
        console.log('res -->', this.notification);
      }
    });
  }

}
