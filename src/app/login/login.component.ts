import { Component, OnInit, Query } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import { map } from 'rxjs/operators';
import { DataService } from '../shared/dataservices/dataService';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Variable declarations
  public loginForm: FormGroup;
  public loginInformation: any;
  public submitted = false;
  constructor(private router: Router, private formBuilder: FormBuilder, private apollo: Apollo, public dataServ: DataService) { }

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
    try {
      this.apollo.query<any>({
        query: gql`
          query {
              login(loginInput: {
                email: "${this.loginForm.value.emailId}",
                password: "${this.loginForm.value.password}"
              }) {
                    token
                    role
                    user_id
                    expiresIn
                  }
               }
          `
          }).subscribe(( res ) => {
            console.log(res);
            if (res) {
              const loginData = res.data.login;
              this.dataServ.saveIntoLocalStorage('TOKEN', loginData.token);
              if (loginData.role === 'ADMIN') {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/user']);
              }
            }
          }, (errors) => {
            alert('Something is wrong');
          });
    } catch (err) {

    }
  }

  /**
   * Switch to Registration page
   */
  public SwitchtoNavigate() {
    this.router.navigate(['/registration']);
  }

}
