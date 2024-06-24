// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebsiteService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  // getAllUsers() {
  //   const apiUrl = '/api/v1/users/all';
  //   return this.apiService.get(
  //     apiUrl,
  //     '',
  //     false,
  //     this.httpHelperService.getTenantHttpOptions()
  //   );
  // }
}
