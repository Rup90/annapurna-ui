import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';


@Injectable({
    providedIn: 'root'
})
export class AppPostService {
    constructor(private http: HttpClient, private apollo: Apollo) {}

    public login() {
        this.apollo.query<any>({
            query: gql`
            {
            books {
              title
              authors {
                name
              }
            }
          }
        `
})
    }
}
