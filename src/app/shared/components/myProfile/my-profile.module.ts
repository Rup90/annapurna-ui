import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyProfileComponent } from './my-profile.component';
import { MyProfileRoutingModule } from './my-profile.router';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyProfileRoutingModule
  ],
  declarations: [MyProfileComponent]
})
export class MyProfileModule { }

