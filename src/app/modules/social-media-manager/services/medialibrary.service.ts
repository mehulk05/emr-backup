import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class MedialibraryService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getLibraries(search: string, tag: any, page: any, size: any) {
    const apiUrl =
      '/api/socialMedia/libraries?page=' +
      page +
      '&size=' +
      size +
      '&search=' +
      search +
      '&tags=' +
      tag;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  imageById(id: any) {
    const apiUrl = '/api/socialMedia/libraries/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createSocialProfile(formData: any) {
    const apiUrl = '/api/social-profiles';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteLibraryById(socialProfileId: any) {
    const apiUrl = '/api/socialMedia/library/' + socialProfileId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  approvePost(id: any) {
    const apiUrl = '/api/socialMediaPost/' + id + '/approve';
    return this.apiService.put(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  /* --------------------------- Calendar page apis --------------------------- */
  getPostDataById(id: any) {
    const apiUrl = '/api/socialMediaPost/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  postList() {
    const apiUrl = '/api/v1/socialMediaPosts/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  get(id: any) {
    const apiUrl = '/api/socialMediaPost/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSocialProfile(id: any) {
    const apiUrl = '/api/social-profiles/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLabels() {
    const apiUrl = '/api/socialMediaPostLabels/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  loadSocialProfiles() {
    const apiUrl = '/api/social-profiles';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  update(id: any, formData: any) {
    console.log(formData);
    const apiUrl = '/api/socialMedia/library/' + id;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  create(formData: any) {
    const apiUrl = '/api/socialMediaPost';
    return this.apiService.post(
      apiUrl,
      formData,
      'Unable to create Post',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  labellist() {
    const apiUrl = '/api/socialMediaPostLabels/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createSocialMediaImagePost(formData: any) {
    const apiUrl = '/api/socialMedia/library';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createPost(formData: any) {
    const apiUrl = '/api/file-manager/library';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  socialProfilelist() {
    const apiUrl = '/api/social-profiles';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  downloadImage(body: any) {
    const apiUrl = '/api/socialMediaPosts/download/image';
    return this.apiService.saveExcelPost(
      apiUrl,
      false,
      body,
      this.httpHelperService.getTenantHttpOptions(),
      false,
      false
    );
  }
}
