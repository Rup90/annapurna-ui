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
  public buttonName = 'Save';
  constructor(private apollo: Apollo,  public dataServ: DataService, private formBuilder: FormBuilder,  private http: HttpClient) { }

  ngOnInit(): void {
    this.initCall();
  }

  public initCall() {
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
          fetchAllProducts {
            ... on ProductDetails {
              statusCode
              products {
                itemName
                category
                id
                itemImage
              }
            }
          }
        }
      `
    }).subscribe(({ data, loading }) => {
      const { statusCode, products} = data.fetchAllProducts;
      if (statusCode === 200) {
        this.allItems = products;
      }
    });
  }


  /**
   * Add items one by one as admin
   */
  public addItems(item?) {
    this.isAddItem = true;
    if (item) {
      this.patchFormData(item);
    }
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
   * Patch Items Data
   */
  public patchFormData(item) {
    console.log(item);
    this.addItemsInDB.patchValue({
      itemName: item.itemName,
      category: item.category
    });
    this.productLocalImage = `http://localhost:8000/${item.itemImage}`;
    this.buttonName = 'Update';
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
    let operationName = '';
    if (this.buttonName === 'Save') {
      operationName = 'addNewItem';
    } else {
      operationName = 'updateNewItem';
    }
    const operation = {
      // tslint:disable-next-line:object-literal-key-quotes
      'query': `mutation ($picture: Upload!) { ${operationName}(picture: $picture, itemInput: { itemName: "${itemName}", category:  "${category}" }) {status, message}}`,
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
     const { status, message} = (this.buttonName === 'Save') ? res.data.addNewItem : res.data.updateNewItem;
     if (status === 200) {
       alert(message);
       this.closeBtn();
     }

    }, (err) => {
      console.log(err);
    });
  }

  /**
   * Delete Item
   */
  public deleteItems(item) {
    try {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation Mutation{
            deletetAddedItem(itemInput: {
              itemName: "${item.itemName}"
            }) {
                  status
                  message
                }
            }
          `
          }).subscribe(( res ) => {
            const { status, message} = res.data.deletetAddedItem;
            if (status === 200) {
              alert(message);
              this.closeBtn();
            }
          }, (errors) => {
            console.log(errors);
          });
      } catch (err) {
        console.log(err);
    }
  }


  /**
   * Button close
   */
   public closeBtn() {
      this.isAddItem = false;
      this.buttonName = 'Save';
      this.productImg = '';
      this.initCall();
   }

}
