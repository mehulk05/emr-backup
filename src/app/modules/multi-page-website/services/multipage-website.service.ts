import { Injectable } from '@angular/core';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MultipageWebsiteService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  create(formData: any) {
    const apiUrl = '/api/v1/website/multipage';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  update(formData: any) {
    const apiUrl = '/api/v1/website/multipage';
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getFiles(name: string) {
    const apiUrl = '/api/v1/website/multipage/' + name;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  downloadZipOfMultipageWebsite(id: string) {
    const apiUrl = '/api/v1/website/multipage/download/' + id;
    return this.apiService.savePdf(
      apiUrl,
      {},
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getWebsite() {
    const apiUrl = '/api/v1/website/multipage/byTenant';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateSinglePageHtmlContent(data: any) {
    const apiUrl = '/api/v1/website/multipage/single';
    return this.apiService.put(
      apiUrl,
      data,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  addNewPageToWebsite(data: any, websiteId: any) {
    const apiUrl = '/api/v1/website/multipage/single/' + websiteId;
    return this.apiService.post(
      apiUrl,
      data,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteMultipageWebsiteById(id: any) {
    const apiUrl = '/api/v1/website/multipage/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteSinglePage(pageId: any) {
    const apiUrl = '/api/v1/website/multipage/single/' + pageId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
