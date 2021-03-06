import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import { Stream } from 'stream';
import { DataService } from '../../dataservices/dataService';
import { Subscription } from 'rxjs';
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
export class MyProfileComponent implements OnInit, OnDestroy {

  public profileForm: FormGroup;
  public profileFormData: any;
  public isLoading =  false;
  public avatar;
  public avatarUploadMsg = '';
  public avatarImage = '';
  public profileSubscription: Subscription;
  constructor(private formBuilder: FormBuilder, private apollo: Apollo, private http: HttpClient, private dataServ: DataService) { }

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
              ... on UserInformationsResponse {
                statusCode
                userInfo {
                  firstName
                  lastName
                  email
                  phoneNumber
                  address
                  role
                  avatar
                }
              }
            }
          }
          `
          }).subscribe(( res ) => {
            const { statusCode, userInfo } = res.data.getUserInfo;
            this.profileFormData = [];
            if (statusCode === 200 && userInfo) {
              this.profileFormData = userInfo;
              this.patchProfileFormData();
            } else {
              this.isLoading = false;
            }
          }, (errors) => {
            this.isLoading = false;
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
    this.avatarImage = this.profileFormData.avatar;
    this.isLoading = false;
  }

  /**
   * Update Profile Funcationalities
   */
  public updateProfile() {
    this.isLoading = true;
    const { firstName, lastName, password, emailId, role, phoneNumber, address } = this.profileForm.value;
    try {
      this.profileSubscription = this.apollo.mutate<any>({
        mutation: gql`
          mutation Mutation{
            updateUserInfo(userInput: {
              firstName: "${firstName}",
              lastName: "${lastName}",
              phoneNumber: "${phoneNumber}",
              address: "${address}",
              role: "${role}",
              email: "${emailId}"
            }) {
                ... on UserInformationsResponse {
                    statusCode
                    userInfo {
                      firstName
                      lastName
                      email
                      phoneNumber
                      address
                      role
                      avatar
                    }
                }
              }
            }
          `
          }).subscribe(( res ) => {
            const { statusCode, userInfo } = res.data.updateUserInfo;
            if (statusCode === 200) {
              this.profileFormData = userInfo;
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
    const type = /(\.jpg|\.jpeg|\.png)$/i;
    this.avatarUploadMsg = '';
    if (!this.avatar) {
      this.avatarUploadMsg = 'Please choose a file';
    } else if (!type.exec(this.avatar.name)) {
      this.avatarUploadMsg = 'File extension is invalid, allowed extensions are: JPG/JPEG/PNG';
    }
    else {
      this.isLoading = true;
      this.uploadImageMutation();
    }
  }

  /**
   * public upoad image mutation
   */
  public uploadImageMutation() {

    const operation = {
      // tslint:disable-next-line:object-literal-key-quotes
      'query': 'mutation Mutation($file: Upload!) { addAvatarImage(file: $file) { ... on AvatarUploadResponse { statusCode, avatar } }}',
      // tslint:disable-next-line:object-literal-key-quotes
      'variables': {
        file: null
      }
    };

    const mapping = {
      0: ['variables.file']
    };
    const fd = new FormData();
    // fd.append('file', this.avatar, this.avatar.name);
    fd.append('operations', JSON.stringify(operation));
    fd.append('map', JSON.stringify(mapping));
    fd.append('0', this.avatar, this.avatar.name);
    const header = {
      headers: new HttpHeaders()
        .set('Authorization',  'Bearer ' + localStorage.getItem('TOKEN'))
        .set('x-refresh-token', 'Bearer ' + localStorage.getItem('x-refresh-token'))
    };
    this.http.post('http://localhost:3000/graphql', fd, header ).subscribe((res: any) => {
     const { statusCode, avatar } = res.data.addAvatarImage;
     if (statusCode === 200 && avatar) {
       this.avatarImage = avatar;
     }
     this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() { }

}
