import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpHelperService } from './HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  checkBusinessEmailExists(bid: any, email: string) {
    const apiUrl = `/api/public/business/email-exists/${email}`;
    return this.apiService.get(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  upgradeToTwoWayText(flag: any, bid: any) {
    const apiUrl = `/api/business/upgradeToTwoWayText/${flag}`;
    return this.apiService.put(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  checkBusinessNameExists(bid: any, name: string) {
    const apiUrl = `/api/public/business/name-exists/${name}`;
    return this.apiService.get(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }

  getAvailableTwilios(geoCode: string, searchDigits: string, bid?: any) {
    const apiUrl =
      geoCode && searchDigits
        ? `/api/public/twilio/available_numbers/${geoCode}/${searchDigits}`
        : geoCode
        ? `/api/public/twilio/available_numbers/${geoCode}`
        : `/api/public/twilio/available_numbers/0/${searchDigits}`;
    console.log('Available NOS URL CALL ==> ' + apiUrl);
    return this.apiService.get(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions(bid)
    );
  }
}
