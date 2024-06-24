import { Injectable } from '@angular/core';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getAllUsers() {
    const apiUrl = '/api/v1/users/all';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
