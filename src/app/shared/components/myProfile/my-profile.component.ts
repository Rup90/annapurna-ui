import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  public profileForm: FormGroup;
  public profileFormData: any;
  public isLoading =  false;
  constructor(private formBuilder: FormBuilder, private apollo: Apollo) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.createProfileFormData();
  }

  /**
   * Fetch User Profile data
   */
  public fetchUserData() {
    try {
      this.apollo.query<any>({
        query: gql`
          query {
            getUserInfo {
              firstName
              lastName
              email
              phoneNumber
              address
              role
              avatar
            }
          }
          `
          }).subscribe(( res ) => {
            if (res.data.getUserInfo) {
              this.profileFormData = res.data.getUserInfo;
              this.patchProfileFormData();
            }
          }, (errors) => {
            this.isLoading = false;
            console.log(errors);
            alert('Something is wrong');
          });
    } catch (err) {
      this.isLoading = false;
    }
  }

  /**
   * Create Profile Form Group
   */
  public createProfileFormData() {
    this.profileForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      emailId: [''],
      role: [''],
      phoneNumber: [''],
      address: ['']
    });
    this.fetchUserData();
  }


  /**
   * Patch Profile form with data
   */
  public patchProfileFormData() {
    this.profileForm.patchValue({
      firstName: this.profileFormData.firstName,
      lastName: this.profileFormData.lastName,
      emailId: this.profileFormData.email,
      role: this.profileFormData.role,
      phoneNumber: this.profileFormData.phoneNumber,
      address: this.profileFormData.address
    });
    this.isLoading = false;
  }

  /**
   * Update Profile Funcationalities
   */
  public updateProfile() {
    this.isLoading = true;
    const { firstName, lastName, password, emailId, role, phoneNumber, address } = this.profileForm.value;
    console.log(firstName, lastName, password, role, phoneNumber, address);
    try {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation {
            updateUserInfo(userInput: {
              firstName: "${firstName}",
              lastName: "${lastName}",
              phoneNumber: "${phoneNumber}",
              address: "${address}",
              role: "${role}",
              email: "${emailId}"
            }) {
                  firstName
                  lastName
                  email
                  phoneNumber
                  address
                  role
                  avatar
                }
               }
          `
          }).subscribe(( res ) => {
            if (res.data.updateUserInfo) {
              this.profileFormData = res.data.updateUserInfo;
              this.patchProfileFormData();
            }
          }, (errors) => {
            this.isLoading = false;
            alert('something is wrong');
          });
    } catch (err) {
      this.isLoading = false;
    }
  }

}
