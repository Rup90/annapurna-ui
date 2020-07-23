import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DashboardRoutingModule } from './dashboard.router.module';
import { DashboardComponent } from './dashboard.component';
import { AlertPopupComponent } from '../shared/components/alert/alert.component';
import { ConfirmPopupComponent } from '../shared/components/confirm-popup/confirm-popup.component';
import { AddEditComponent } from '../shared/components/add-edit/add-edit.component';
import { NotificationService } from '../shared/dataservices/notification.service';


@NgModule({
  declarations: [DashboardComponent, AlertPopupComponent, ConfirmPopupComponent, AddEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    DashboardRoutingModule
  ],
  providers: [NotificationService]
})
export class DashboardModule { }
