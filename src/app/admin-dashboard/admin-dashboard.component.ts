import { Component, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import { DataService } from '../shared/dataservices/dataService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Stream } from 'stream';

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

export interface NewItemInput {
  itemName: string;
  category: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  public allItems = [];
  public isAddItem = false;
  public itemCategories = [
    {
      key: 'AGRICULTURE',
      value: 'Agriculture'
    },
    {
      key: 'DAIRY',
      value: 'Dairy'
    },
    {
      key: 'LIVESTOCK',
      value: 'Livestock'
    }
  ];
  public addItemsInDB: FormGroup;
  public productImg;
  public productLocalImage;
  public productImgMsg = '';
  constructor(private apollo: Apollo,  public dataServ: DataService, private formBuilder: FormBuilder,  private http: HttpClient) { }

  ngOnInit(): void {
    this.createItemsFormData();
    this.fetchItems();
  }

  /**
   * Fetch List of Items
   */
  public fetchItems() {
    this.apollo.query<any>({
      query: gql`
        query {
          fetchAllItems {
            itemName
            category
            id
            itemImage
          }
        }
      `
    }).subscribe(({ data, loading }) => {
      if (data) {
        this.allItems = data.fetchAllItems;
      }
    });
  }


  /**
   * Add items one by one as admin
   */
  public addItems() {
     this.isAddItem = true;
  }

  /**
   * Create Items Form Group
   */
  public createItemsFormData() {
    this.addItemsInDB = this.formBuilder.group({
      itemName: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  /**
   * Upload Product image
   */
  public uploadProductImg(event) {
    this.productImg = event.target.files[0] as File;
    const type = /(\.jpg|\.jpeg|\.png)$/i;
    this.productImgMsg = '';
    if (!this.productImg) {
      this.productImgMsg = 'Please choose a file';
    } else if (!type.exec(this.productImg.name)) {
      this.productImgMsg = 'File extension is invalid, allowed extensions are: JPG/JPEG/PNG';
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.productLocalImage = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  /**
   * Save Item to DB
   */
  public saveItem() {
    const {itemName, category} = this.addItemsInDB.value;
    const operation = {
      // tslint:disable-next-line:object-literal-key-quotes
      'query': `mutation ($picture: Upload!) { addNewItem(picture: $picture, itemInput: { itemName: "${itemName}", category:  "${category}" }) {status, itemName}}`,
      // tslint:disable-next-line:object-literal-key-quotes
      'variables': {
        picture: null
      }
    };

    const mapping = {
      0: ['variables.picture']
    };
    const fd = new FormData();
    fd.append('operations', JSON.stringify(operation));
    fd.append('map', JSON.stringify(mapping));
    fd.append('0', this.productImg, this.productImg.name);
    const header = {
      headers: new HttpHeaders()
        .set('Authorization',  'Bearer ' + localStorage.getItem('TOKEN'))
    };
    this.http.post('http://localhost:8000/graphql', fd, header ).subscribe((res: any) => {
     const { status} = res.data.addNewItem;
     if (status === 200) {
       alert(res.data.addNewItem.itemName);
       this.productLocalImage = '';
       this.createItemsFormData();
     }

    }, (err) => {
      console.log(err);
    });
  }


  /**
   * Button close
   */
   public closeBtn() {
      this.isAddItem = false;
      this.fetchItems();
   }

}
