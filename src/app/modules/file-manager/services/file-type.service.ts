import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileTypeService {
  constructor() {}

  isImage(data: any) {
    return data && data.contentType.split('/')[0] === 'image';
  }

  isPDF(data: any) {
    return data && data.contentType === 'application/pdf';
  }

  isZip(data: any) {
    return data && data.contentType === 'application/zip';
  }

  isDoc(data: any) {
    return (
      data &&
      data.contentType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
  }

  isFolder(data: any) {
    return data && data.contentType === 'folder';
  }

  isExcel(data: any) {
    return (
      data &&
      (data.contentType ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        data.contentType === 'application/vnd.ms-excel')
    );
  }

  isPpt(data: any) {
    return (
      data &&
      data.contentType ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    );
  }

  isVideo(data: any) {
    return (
      data &&
      ['video/x-msvideo', 'text/csv', 'video/mp4', 'video/mpeg'].includes(
        data.contentType
      )
    );
  }
}
