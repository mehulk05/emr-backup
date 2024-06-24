import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {
  businessId: number = 0;
  constructor(private localStorageService: LocalStorageService) {}

  getTenantHttpOptions(businessId?: any) {
    businessId = businessId ? businessId : this.businessId;
    //console.log('businessId', businessId);
    if (!businessId) {
      businessId =
        this.localStorageService.readStorage('currentUser')?.businessId;
    }
    this.businessId = businessId;
    //console.log('businessId', businessId);
    const httpOptions = {
      'X-TenantID': '' + businessId
    };

    return httpOptions;
  }

  getTenantHttpOptionsForHtml(businessId?: any) {
    //console.log('bu', businessId, this.businessId);
    //businessId = businessId ? businessId : this.businessId;
    if (!businessId) {
      //console.log('bbb');
      businessId =
        this.localStorageService.readStorage('currentUser')?.businessId;
    }
    console.log('buss', businessId);
    const httpOptions = {
      'X-TenantID': '' + businessId,
      responseType: 'text' as 'json'
    };
    return httpOptions;
  }

  getTenantHttpOptionsinHeadersForFile() {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-TenantID', '' + this.businessId)
      .set('responseType', 'blob' as 'json');

    const httpOptions = {
      headers: headers
    };
    return httpOptions;
  }

  getTenantHttpOptionsinHeaders() {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-TenantID', '' + this.businessId);

    const httpOptions = {
      headers: headers
    };
    return httpOptions;
  }

  getHttpOptionsForUpload() {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json'
      })
    };
    return httpOptions;
  }

  getHttpOptionsForEmailUnsubscribe(tenantId: any) {
    const httpOptions = {
      'X-TenantID': '' + tenantId,
      responseType: 'text' as 'json'
    };
    return httpOptions;
  }
}
