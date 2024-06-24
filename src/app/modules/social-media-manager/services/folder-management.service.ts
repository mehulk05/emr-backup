import { Injectable } from '@angular/core';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FolderManagementService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getFolder(search?: string, tag?: any, page?: any, size?: any) {
    const apiUrl =
      '/api/socialmedia/folder?page=' +
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
    const apiUrl = '/api/socialmedia/folder/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getFilesByFolderId(id: any, selectedTag: string = '') {
    const apiUrl = `/api/socialMedia/libraries/folder/${id}?tags=${selectedTag}&page=0&size=1000&search=`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateFolder(id: any, formData: any) {
    const apiUrl = '/api/socialmedia/folder/' + id;
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

  socialMediaTagList() {
    const apiUrl = '/api/socialMedia/tag/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  addFolder(formData: any) {
    const apiUrl = '/api/socialmedia/folder';
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

  deleteFolder(folderId: any) {
    const apiUrl = '/api/socialmedia/folder/' + folderId;
    return this.apiService.delete(
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

  addFilesToFolder(formData: any) {
    const apiUrl = '/api/socialMedia/library';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  downloadImage(body: any) {
    const apiUrl = '/api/socialMedia/download/file';
    return this.apiService.saveExcelPost(
      apiUrl,
      false,
      body,
      this.httpHelperService.getTenantHttpOptions(),
      false,
      false
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

  updateFile(id: any, formData: any) {
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

  imageById(id: any) {
    const apiUrl = '/api/socialMedia/libraries/' + id;
    return this.apiService.get(
      apiUrl,
      '',
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
}
