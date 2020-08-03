import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNotificationComponent } from './admin-notification.component';
import { AdminNotificationRoutingModule } from './admin-notification.router';
import { NotificationService } from '../shared/dataservices/notification.service';



@NgModule({
  declarations: [AdminNotificationComponent],
  imports: [
    CommonModule,
    AdminNotificationRoutingModule
  ],
  providers: [NotificationService]
})
export class AdminNotificationModule { }
