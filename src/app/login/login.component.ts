import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Variable declarations
  public loginForm: FormGroup;

  public submitted = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private apollo: Apollo) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  get formFields() { return this.loginForm.controls; }

  /**
   * Create Login Form
   */
   public createLoginForm() {
      this.loginForm = this.formBuilder.group({
        emailId: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        password: ['', Validators.required]
      });
   }

   /**
    * Login functionalities
    */
  public proceedForLogin() {
    if (this.loginForm.invalid) {
      this.submitted = true;
      return;
    }
    this.fetchLoginData();
  }


  /**
   * Fetch Data from GraphQL
   */
  public fetchLoginData() {
    console.log(this.loginForm);
    this.router.navigate(['/admin']);
  }

  /**
   * Switch to Registration page
   */
  public SwitchtoNavigate() {
    this.router.navigate(['/registration']);
  }

}
