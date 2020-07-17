import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import {  HomeComponent } from '../shared/components/home/home.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path:  'profile',
        loadChildren: () => import('../shared/components/myProfile/my-profile.module').then(m => m.MyProfileModule)
      },
      {
        path:  'home',
        loadChildren: () => import('../shared/components/home/home.module').then(m => m.HomwModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
