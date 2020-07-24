import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddedItemsComponent } from './added-items.component';


const routes: Routes = [
  {
    path: '',
    component: AddedItemsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
