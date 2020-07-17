import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing.module';
import { AlertPopupComponent } from '../alert/alert.component';
import { ConfirmPopupComponent } from '../confirm-popup/confirm-popup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent, AlertPopupComponent, ConfirmPopupComponent]
})
export class HomwModule { }

