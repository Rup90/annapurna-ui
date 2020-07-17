import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard.router.module';
import { DashboardComponent } from './dashboard.component';
import {  SideNavBarComponent } from '../shared/components/sideNavBar/side-nav-bar.component';


@NgModule({
  declarations: [DashboardComponent, SideNavBarComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
