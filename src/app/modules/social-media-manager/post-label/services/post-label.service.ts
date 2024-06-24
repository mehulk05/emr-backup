import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class PostLabelService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getPostLabels() {
    const apiUrl = '/api/socialMediaPostLabels/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createPostLabels(formData: any) {
    const apiUrl = '/api/socialMediaPostLabel';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deletePostLabels(socialProfileId: any) {
    const apiUrl = '/api/socialMediaPostLabel/' + socialProfileId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  get(id: any) {
    const apiUrl = '/api/socialMediaPostLabel/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  update(id: any, formData: any) {
    const apiUrl = '/api/socialMediaPostLabel/' + id;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
