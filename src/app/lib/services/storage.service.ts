import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    await this.storage.defineDriver(CordovaSQLiteDriver);
  }

  //Store the value
  async set(key: string, value: any) {
    const encryptedValue = btoa(escape(JSON.stringify(value)));
    await localStorage.setItem(key, encryptedValue);
  }

  //Store the value
  setItemNativeCatalog(key: string, value: any) {
    //console.log("Value 1: "+JSON.stringify(value));  
    //console.log("Value 2: "+value);  
    this.storage?.set(key, JSON.stringify(value)).then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );

  }

  //Get the value
  async get(key: string) {
    const res = await localStorage.getItem(key);
    if (res) {
      return JSON.parse(unescape(atob(res)));
    } else {
      return false;
    }
  }

  //Remove the value
  async remove(key: string) {
    await localStorage.removeItem(key);
  }

  //Clear Storage
  async clear() {
    await localStorage.clear;
  }

  //Store the value
  setItem(key: string, value: any) {
    const encryptedValue = btoa(escape(JSON.stringify(value)));
    localStorage.setItem(key, encryptedValue);
  }

  //Get the value
  getItem(key: string) {
    const res = localStorage.getItem(key);
    if (res) {
      return JSON.parse(unescape(atob(res)));
    } else {
      return false;
    }
  }

  async getItemNativeCatalog(key: string) {
    return await this.storage?.get(key);
  }

  public clearNativeCatalog() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }

  async removeItemNativeCatalog(key: string) {
    await this.storage.remove(key);
  }

  getItemWithPromise(key: string) {
    return new Promise((resolve, reject) => {
      resolve(this.getItem(key));
    });
  }
}
