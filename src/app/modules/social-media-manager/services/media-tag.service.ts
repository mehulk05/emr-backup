import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
@Injectable({
  providedIn: 'root'
})
export class MediaTagService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  socialMediaTagList() {
    const apiUrl = '/api/socialMedia/tag/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  fileManagerTagList() {
    const apiUrl = '/api/file-manager/tag/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteTagById(id: any) {
    const apiUrl = '/api/socialMedia/tag/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteTagFileManagerById(id: any) {
    const apiUrl = '/api/file-manager/tag/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  create(formData: any) {
    const apiUrl = '/api/socialMedia/tag';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  get(id: any) {
    const apiUrl = '/api/socialMedia/tag/' + id;
    return this.apiService.get(
      apiUrl,
      'Unable to load tag',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  update(id: any, formData: any) {
    const apiUrl = '/api/socialMedia/tag/' + id;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  list() {
    const apiUrl = '/api/socialMedia/tag/list';
    return this.apiService.get(
      apiUrl,
      'Unable to load tags',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
