import { Injectable } from '@angular/core';
import { decode } from 'jsonwebtoken';
@Injectable({
    providedIn: 'root'
})

export class DataService {

    public saveObj = {};
    public saveIntoLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }

    public getFromLocalStorage(key) {
        return localStorage.getItem(key);
    }

    public saveData(key, value) {
        this.saveObj[key] = value;
    }

    public getData(key) {
        return this.saveObj[key];
    }
}
