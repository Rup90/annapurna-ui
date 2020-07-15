import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration.component';
import { RegistrationRoutingModule } from './registration.router.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegistrationRoutingModule
  ],
  declarations: [RegistrationComponent]
})
export class RegistrationModule { }
