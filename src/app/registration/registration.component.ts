import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  // Variable declarations
  public Roles = [
    {
      key: 'ADMIN',
      value: 'Admin'
    },
    {
      key: 'FARMAR',
      value: 'Farmar'
    }
  ];
  public regForm: FormGroup;
  public submitted = false;
  constructor(private router: Router, private formBuilder: FormBuilder, private apollo: Apollo) { }

  get formFields() { return this.regForm.controls; }

  ngOnInit(): void {
    this.createRegForm();
  }

  /**
   * Create Registration Form
   */
  public createRegForm() {
    this.regForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      role: ['FARMAR'],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }


 /**
  * Registration functionalities
  */
  public proceedForRegistration(formValue) {
    if (this.regForm.invalid) {
      this.submitted = true;
      return;
    }
    this.registerUser();
  }

  /**
   * Registration Mutation
   */
  public registerUser() {
    const { firstName, lastName, emailId, password, role } = this.regForm.value;
    try {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation {
            registration(userInput: {
              firstName: "${firstName}",
              lastName: "${lastName}",
              email: "${emailId}",
              password: "${password}",
              role: "${role}"
            }) {
                    status,
                    message
                    email
                    mailInfo
                  }
               }
          `
          }).subscribe(( res ) => {
            console.log(res.data);
            if (res) {
                const { status, message } = res.data.registration;
                if (status === 200) {
                  alert(message);
                  this.createRegForm();
                  this.router.navigate(['/login']);
                }
            }

          }, (errors) => {
           console.log(errors);
          });
    } catch (err) {

    }

  }
  public SwitchtoNavigate() {
    this.router.navigate(['/login']);
  }

}
