import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddedItemsComponent } from './added-items.component';
import { AdminDashboardRoutingModule } from './add-items.router.module';
import { ViewItemsComponent } from '../shared/components/view-items/view-items.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddedItemsComponent, ViewItemsComponent],
  imports: [
    CommonModule,
    FormsModule,
    AdminDashboardRoutingModule
  ]
})
export class AddedItemsModule { }
