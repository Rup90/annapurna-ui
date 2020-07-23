import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminDashboardRoutingModule } from './admin-dashboard.router.module';
import { NotificationService } from '../shared/dataservices/notification.service';

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    AdminDashboardRoutingModule
  ],
  providers: [NotificationService]
})
export class AdminDashboardModule { }
