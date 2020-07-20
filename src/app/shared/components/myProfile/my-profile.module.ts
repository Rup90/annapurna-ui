import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyProfileComponent } from './my-profile.component';
import { MyProfileRoutingModule } from './my-profile.router';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MyProfileRoutingModule
  ],
  declarations: [MyProfileComponent]
})
export class MyProfileModule { }

