import { Injectable } from '@angular/core';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getLibraries(search: string, tag: any, page: any, size: any) {
    const apiUrl =
      '/api/file-manager/libraries?page=' +
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

  getFolder(search?: string, tag?: any, page?: any, size?: any) {
    const apiUrl =
      '/api/fileManager/folder?page=' +
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

  getFolderById(id: any) {
    const apiUrl = '/api/fileManager/folder/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getFilesByFolderId(id: any) {
    const apiUrl = '/api/file-manager/libraries/folder/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  imageById(id: any) {
    const apiUrl = '/api/file-manager/libraries/' + id;
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
  updateFolder(id: any, formData: any) {
    const apiUrl = '/api/fileManager/folder/' + id;
    return this.apiService.put(
      apiUrl,
      formData,
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

  addFolder(formData: any) {
    const apiUrl = '/api/fileManager/folder';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteLibraryById(socialProfileId: any) {
    const apiUrl = '/api/file-manager/library/' + socialProfileId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteFolder(folderId: any) {
    const apiUrl = '/api/fileManager/folder/' + folderId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  approvePost(id: any) {
    const apiUrl = '/api/file-manager/' + id + '/approve';
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
    const apiUrl = '/api/file-manager/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  postList() {
    const apiUrl = '/api/v1/file-manager/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
  get(id: any) {
    const apiUrl = '/api/file-manager/' + id;
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
    const apiUrl = '/api/file-manager/library/' + id;
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

  createTag(formData: any) {
    const apiUrl = '/api/socialMedia/tag';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
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

  addFilesToFolder(formData: any) {
    const apiUrl = '/api/file-manager/library';
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
    const apiUrl = '/api/file-manager/download/file';
    return this.apiService.saveExcelPost(
      apiUrl,
      false,
      body,
      this.httpHelperService.getTenantHttpOptions(),
      false,
      false
    );
  }

  getPrivateUrl(id: any) {
    const apiUrl = '/api/file-manager/signedUrl/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getFilesByTagsAndId(id: any, selectedTag: string = '') {
    const apiUrl = `/api/file-manager/libraries/bytags/${id}?tags=${selectedTag}&page=0&size=1000&search=`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
