import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';

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
  constructor(private router: Router, private formBuilder: FormBuilder) { }

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
    console.log(this.regForm);
  }


  public SwitchtoNavigate() {
    this.router.navigate(['/login']);
  }

}
