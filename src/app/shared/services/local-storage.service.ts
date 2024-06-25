import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as localforage from 'localforage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (typeof localforage.config === 'function') {
      localforage.config({
        driver: [
          localforage.INDEXEDDB,
          localforage.WEBSQL,
          localforage.LOCALSTORAGE
        ],
        storeName: 'emr',
        name: 'emr'
      });
    } else {
      console.error('localforage.config is not a function');
    }
  }

  storeItem(key: string, value: any) {
    return localStorage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    );
  }

  storeItemInSession(key: string, value: any) {
    return sessionStorage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    );
  }

  readStorage(key: string) {
    const result: any = localStorage.getItem(key);
    return JSON.parse(result);
  }

  removeStorage(key: string) {
    localStorage.removeItem(key);
  }

  clearStorage() {
    localStorage.clear();
  }

  setDataInIndexedDB(key: string, value: any) {
    return localforage
      .setItem(key, JSON.stringify(value))
      .then(() => {
        // do something
      })
      .catch(() => {
        // do something
      });
  }

  async getDataFromIndexedDB(key: string) {
    return new Promise((resolve, reject) => {
      localforage
        .getItem(key)
        .then((result: any) => {
          resolve(JSON.parse(result));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  removeDataFromIndexedDB(key: string) {
    return new Promise((resolve, reject) => {
      localforage
        .removeItem(key)
        .then(() => {
          const remove = 'Key Removed';
          return resolve(remove);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  clearDataFromIndexedDB() {
    return localforage.clear();
  }
}
