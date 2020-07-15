import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminDashboardRoutingModule } from './admin-dashboard.router.module';

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule
  ]
})
export class AdminDashboardModule { }
