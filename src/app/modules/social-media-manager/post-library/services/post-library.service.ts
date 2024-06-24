import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class PostLibraryService {
  private selectedImage = new BehaviorSubject<any>(null);

  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getPostsByPages(page: any, size: any) {
    const apiUrl =
      '/api/v1/socialMediaPosts/pagination/list?page=' + page + '&size=' + size;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSocialPProfiles() {
    const apiUrl = '/api/social-profiles';
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

  deleteSocialProfile(socialProfileId: any) {
    const apiUrl = '/api/social-profiles/' + socialProfileId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deletePostById(id: any) {
    const apiUrl = '/api/socialMediaPost/' + id;
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

  updatePost(id: any, formData: any) {
    const apiUrl = '/api/socialMediaPost/' + id;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  update(id: any, formData: any) {
    console.log(formData);
    const apiUrl = '/api/socialMediaPost/' + id;
    return this.apiService.put(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getHttpOptionsForUpload()
    );
  }

  updateSocialProfile(id: any, formData: any) {
    console.log(formData);
    const apiUrl = '/api/social-profiles/' + id;
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
      this.httpHelperService.getHttpOptionsForUpload()
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

  diableEnablePost(disabled: any) {
    const apiUrl = '/api/socialMediaPost/config/disabled?disabled=' + disabled;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createPost(formData: any) {
    const apiUrl = '/api/socialMediaPost';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createPostConfig(formData: any) {
    const apiUrl = '/api/socialMediaPost/config';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  socialPostConfiglist() {
    const apiUrl = '/api/socialMediaPost/config';
    return this.apiService.get(
      apiUrl,
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

  selectImage(data: any) {
    this.selectedImage.next(data);
  }

  getImage() {
    return this.selectedImage.asObservable();
  }
}
