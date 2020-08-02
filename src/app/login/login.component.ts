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
          query Query{
              login(
                email: "${this.loginForm.value.emailId}",
                password: "${this.loginForm.value.password}"
              ) {
                ... on LoginFaliureResponse {
                  statusCode
                  response {
                    message
                  }
                }
                ... on LoginSuccessResponse {
                  statusCode
                  response {
                    token
                    refreshToken
                    user_id
                    refreshToken
                    role
                  }
                }
              }
            }
          `
          }).subscribe(( res ) => {
            const { data } = res;
            console.log(data);
            if (data) {
              const { statusCode, response } = data.login;
              if (statusCode === 422) {
                alert(response.message);
              } else {
                this.dataServ.saveIntoLocalStorage('TOKEN', response.token);
                this.dataServ.saveIntoLocalStorage('REFRESH-TOKEN', response.refreshToken);
                if (response.role === 'ADMIN') {
                  this.router.navigate(['/admin/home']);
                } else {
                  this.router.navigate(['/user/home']);
                }
              }
            }
          }, (errors) => {
            // alert('Something is wrong');
            console.log(errors);
          });
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Switch to Registration page
   */
  public SwitchtoNavigate() {
    this.router.navigate(['/registration']);
  }

}
