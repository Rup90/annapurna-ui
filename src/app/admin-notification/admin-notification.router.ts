import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminNotificationComponent } from './admin-notification.component';


const routes: Routes = [
  {
    path: '',
    component: AdminNotificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminNotificationRoutingModule { }
