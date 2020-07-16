import { Injectable } from '@angular/core';
import { decode } from 'jsonwebtoken';
@Injectable({
    providedIn: 'root'
})

export class DataService {

    /**
     * Save value in Localstorage
     */
    public saveIntoLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }

    public getFromLocalStorage(key) {
        localStorage.getItem(key);
    }

    public deCodeToken() {
        const token = this.getFromLocalStorage('TOKEN');
        // const decoded = decode(token, {complete: true});
        // console.log(decoded);
    }
}
