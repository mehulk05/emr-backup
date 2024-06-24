import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getOptimizedLandingPageList(page?: number, size?: number, search?: string) {
    if (!search) {
      search = '';
    }
    const apiUrl =
      '/api/v1/landingPage/page?page=' +
      page +
      '&size=' +
      size +
      '&search=' +
      search;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  tagList(type: any) {
    const apiUrl = '/api/ltag/list?type=' + type;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLandingPageWithServiceList(search?: string, tags?: any) {
    if (!search) {
      search = '';
    }
    const apiUrl =
      '/api/v1/landing-pages/services?search=' + search + '&tags=' + tags;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOtherLandingPageList(search?: string, tags?: any) {
    if (!search) {
      search = '';
    }
    const apiUrl =
      '/api/v1/landing-pages/others?search=' + search + '&tags=' + tags;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOtherLandingPage(search?: string) {
    if (!search) {
      search = '';
    }
    const apiUrl = '/api/v1/landing-pages/others?search=' + search;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLibraryPages(page?: number, size?: number, search?: string) {
    if (!search) {
      search = '';
    }
    const apiUrl =
      '/api/public/admin/landingpages?page=' +
      page +
      '&size=' +
      size +
      '&search=' +
      search;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  copyTemplateToMyTemplate(id: any) {
    const apiUrl = '/api/adminlandingpage/' + id;
    return this.apiService.put(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getMyLandingPageList(page?: number, size?: number) {
    const apiUrl = '/api/v1/landingPage/my-page?page=' + page + '&size=' + size;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateLandingPage(id: number) {
    const apiUrl = '/api/landingpage/' + id + '/selected/website';
    return this.apiService.put(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  update(id: any, formData: any) {
    const apiUrl = '/api/landingpage/' + id;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  create(formData: any) {
    const apiUrl = '/api/landingpage';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getEditLandingPage(id: any) {
    const apiUrl = '/api/landingpage/edit/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLandingPageCount() {
    const apiUrl = '/api/landingpage/page/count';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteLandingPage(id: any) {
    const apiUrl = '/api/landingpage/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getBusinessData(bid: string) {
    const apiUrl = '/api/public/v1/businesses/' + bid;
    return this.apiService.get(
      apiUrl,
      '',
      true,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
