import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import { Stream } from 'stream';

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  public profileForm: FormGroup;
  public profileFormData: any;
  public isLoading =  false;
  public avatar;
  public avatarUploadMsg = '';
  constructor(private formBuilder: FormBuilder, private apollo: Apollo, private http: HttpClient) { }

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

  /**
   * Upload profile image
   */
  public avatarUpload(event) {
    this.avatar = event.target.files[0] as File;
    console.log('excelFileData ==>', this.avatar);
    const type = /(\.jpg|\.jpeg|\.png)$/i;
    this.avatarUploadMsg = '';
    if (!this.avatar) {
      this.avatarUploadMsg = 'Please choose a file';
    }
    // else if (!type.exec(this.avatar.name)) {
    //   this.avatarUploadMsg = 'File extension is invalid, allowed extensions are: PDF, JPG/JPEG/PNG, DOC, ZIP/RAR';
    // }
    else {
      this.uploadImageMutation();
    }
  }

  /**
   * public upoad image mutation
   */
  public uploadImageMutation() {
    console.log('image');

    // const query = `
    //   mutation addProfilePicture($file: Upload!) {
    //     addProfilePicture(file: $file) {
    //           filename
    //           mimetype
    //           filesize
    //       }
    //   }
    // `;

    const operation = {
      // tslint:disable-next-line:object-literal-key-quotes
      'query': 'mutation ($picture: Upload!) { addProfilePicture(picture: $picture) { res }}',
      // tslint:disable-next-line:object-literal-key-quotes
      'variables': {
        picture: null
      }
    };

    const mapping = {
      0: ['variables.picture']
    };
    const fd = new FormData();
    // fd.append('file', this.avatar, this.avatar.name);
    fd.append('operations', JSON.stringify(operation));
    fd.append('map', JSON.stringify(mapping));
    fd.append('0', this.avatar, this.avatar.name);
    this.http.post('http://localhost:8000/graphql', fd).subscribe(res => {
      console.log(res);
    }, (err) => {
      console.log(err);
    })
    // this.apollo.mutate<any>({
    //   mutation: gql`
    //     mutation {
    //       addProfilePicture(picture: {
    //         createReadStream: "${fd}",
    //         filename: "${this.avatar.name}"
    //       })
    //       }
    //     `
    //     }).subscribe(( res ) => {
    //       console.log(res);
    //     }, (errors) => {
    //       console.log(errors);
    //     });

    // this.apollo.mutate<any>({
    //   mutation: gql`
    //     mutation {
    //       addProfilePicture(file: {
    //         size: "${this.avatar.size}",
    //         name: "${this.avatar.name}",
    //         type: "${this.avatar.type}"
    //       })
    //       }
    //     `
    //     }).subscribe(( res ) => {
    //       console.log(res);
    //     }, (errors) => {
    //       console.log(errors);
    //     });
  }

}
