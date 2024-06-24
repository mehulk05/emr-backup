import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { FileSaverService } from 'ngx-filesaver';
import { MediaTagService } from '../social-media-manager/services/media-tag.service';
import { FileManagerService } from './services/file-manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvertImageService } from 'src/app/shared/services/image-utils/convertImage.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {
  acceptable_types = [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'video/x-msvideo',
    'text/csv',
    'video/mp4',
    'video/mpeg',
    'application/vnd.oasis.opendocument.presentation',
    'application/vnd.oasis.opendocument.spreadsheet'
  ];
  @ViewChild('fileDropRef') inputVariable: ElementRef;

  pageSearchFilter: any = '';
  isAddImageModalVisible = false;
  libraryForm!: FormGroup;
  croppedImage: any = '';
  selectedFile: File;
  files: any[] = [];
  editId: any;
  selectedTagModel: any = '';
  filtertedTagText = '';
  uploadPost: boolean = true;
  selectedIndex: any = 0;
  sources = ['myWebsite', 'Libary'];
  source: any = 'myWebsite';
  websiteLink: any;
  landingPageLibraryLink: any;
  modifiedTemplates: any = [];
  libraries: any = [];
  libraryTemplates: any = [];
  landingPages: any;

  ssrDomain = environment.SSR_DOMAIN;
  loggedInUser: any;
  domain: any = environment.OLD_EMR_DOMAIN;
  link: any = null;
  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 10, //rows,
    recordArray: [10, 20, 25, 30, 50],
    currentRecordIndex: 1,
    count: 0
  };

  totalDataCount: any = 0;
  totalDataCustomCount: any = 0;
  previwThumbnailLink: string;

  globalFilterColumn = [
    'id',
    'File Type',
    'filename',
    'isPrivate',
    'socialTags',
    'actions',
    'createdBy',
    'updatedBy',
    'updatedAt',
    'createdAt'
  ];
  columns = [
    { header: 'Id', field: 'id', order: 1 },
    { header: 'File Type', field: 'location', order: 2 },
    { header: 'File Name', field: 'filename', order: 3 },
    { header: 'Tags', field: 'socialTags', order: 4 },
    { header: 'Sharing', field: 'isPrivate', order: 4 },
    { header: 'Actions', field: 'actions', order: 5 },
    { header: 'created By', field: 'createdBy', order: 6 },
    { header: 'Updated By', field: 'updatedBy', order: 7 },
    { header: 'Updated At', field: 'updatedAt', order: 8 },
    { header: 'Created At', field: 'createdAt', order: 9 }
  ];

  rows = 10;
  rowData: any[] = [];
  mediaTags: any[] = [];
  selectedTag: any = '';

  _selectedColumns = [
    { header: 'Id', field: 'id', order: 1 },
    { header: 'File Type', field: 'location', order: 2 },
    { header: 'File Name', field: 'filename', order: 3 },
    { header: 'Tags', field: 'socialTags', order: 4 },
    { header: 'Sharing', field: 'isPrivate', order: 4 },
    { header: 'Actions', field: 'actions', order: 5 }
  ];
  imageChangedEvent: string;
  showUploadButton: boolean;
  myFileInput: any;
  tagSelect: boolean;
  fileType: any;
  contentType: any;
  details: any;
  previewModelShow: boolean = false;

  constructor(
    private router: Router,
    private fileManagerService: FileManagerService,
    private alertService: ToasTMessageService,
    private mediaTagService: MediaTagService,
    public formatTimeService: FormatTimeService,
    public fileSaverService: FileSaverService,
    private imageUtilService: ConvertImageService,
    private medialibraryService: FileManagerService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.libraryForm = this.formBuilder.group({
      tags: ['', [Validators.required]],
      file: ['', []],
      isPrivate: [false, [Validators.required]]
    });
    this.getLibraries(
      this.pageSearchFilter,
      this.selectedTag,
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
    this.getTags();
  }

  @Input()
  set selectedColumns(selectedColumns: any) {
    this._selectedColumns = selectedColumns;
    this._selectedColumns.sort((a: any, b: any) => a.order - b.order);
  }

  get selectedColumns(): any {
    return this._selectedColumns;
  }

  getLibraries(search: string, tag: string, page?: number, size?: number) {
    this.fileManagerService.getLibraries(search, tag, page, size).then(
      (response: any) => {
        this.libraries = response.content;
        this.rowData = response.content;
        this.paginatorConfig.totalPage = response.totalPages;
        this.paginatorConfig.count = response.totalElements;
        this.totalDataCount = response.totalElements;
        this.formatTimeInData();
      },
      () => {
        this.alertService.error('Unable to load library images.');
      }
    );
  }

  addNewLibrary() {
    // this.router.navigate(['file-manager/add']);
    this.isAddImageModalVisible = true;
  }

  addTag() {
    this.router.navigate(['file-manager/tags'], {
      queryParams: { page: 'FILE_MANAGER' }
    });
  }

  formatTimeInData() {
    this.rowData.map((data, i) => {
      this.rowData[i].createdAt = this.formatTimeService.formatTime(
        data.createdAt
      );
      this.rowData[i].updatedAt = this.formatTimeService.formatTime(
        data.updatedAt
      );
    });
  }

  refreshPage(e: any) {
    console.log(e);
    this.getLibraries(
      this.pageSearchFilter,
      this.selectedTag,
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
  }

  getTags() {
    this.mediaTagService
      .fileManagerTagList()
      .then((data: any) => {
        this.mediaTags = data.sort((a: any, b: any) => (a.id > b.id ? -1 : 1));
      })
      .catch(() => {
        this.alertService.error('Unable to load Media Tags');
      });
  }

  paginate(event: any) {
    console.log(event);
    this.paginatorConfig.noOfRecord = event.rows;
    this.paginatorConfig.currentPage =
      event.first / this.paginatorConfig.noOfRecord;
    this.paginatorConfig.currentRecordIndex =
      event.first / this.paginatorConfig.noOfRecord;
    this.getLibraries(
      this.pageSearchFilter,
      this.selectedTag,
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
  }

  deleteTrash(data: any) {
    if (confirm('Do you want to delete?') == true) {
      this.fileManagerService.deleteLibraryById(data).then(
        () => {
          this.alertService.success('File deleted successfully');
          this.getLibraries(
            this.pageSearchFilter,
            this.selectedTag,
            this.paginatorConfig.currentPage,
            this.paginatorConfig.noOfRecord
          );
        },
        () => {
          this.alertService.error('Unable to delete library image.');
        }
      );
    }
  }

  editPage(data: any) {
    // this.router.navigate(['file-manager/edit'], {
    //   queryParams: { id: data }
    // });
    this.editId = data;
    this.getImageById();
  }

  preview() {
    this.isAddImageModalVisible = false;
    this.previewModelShow = true;
  }

  previewModelClose() {
    this.previewModelShow = false;
    this.isAddImageModalVisible = false;
    this.editId = null;
  }

  fileTypeExists(fileType: any, show: boolean) {
    if (show && fileType && fileType.split('/')[0] === 'image') {
      return true;
    } else if (fileType && fileType === 'application/pdf') {
      return true;
    } else if (
      fileType &&
      ['video/x-msvideo', 'video/mp4', 'video/mpeg'].includes(fileType)
    ) {
      return true;
    }
    return false;
  }

  searchPage() {
    this.getLibraries(
      this.pageSearchFilter,
      this.selectedTag,
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
  }

  onTagSelected() {
    if (this.selectedTag === 'All') {
      this.pageSearchFilter = '';
    }

    this.getLibraries(
      this.pageSearchFilter,
      this.selectedTag,
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
  }
  onFilter(data: any) {
    console.log(data.filter);
    this.filtertedTagText = data.filter;
  }

  onTagSelect(e: any) {
    this.selectedTagModel = e.value;
    console.log('selected', this.selectedTagModel);
    if (this.selectedTagModel.length === 0) {
      this.tagSelect = true;
    } else {
      this.tagSelect = false;
    }
  }

  getTag(tag: any) {
    return tag?.map((response: any) => {
      return response?.libraryTag?.name;
    });
  }

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

  copyToClipboard(location: any) {
    navigator.clipboard.writeText(location).then(() => {
      this.alertService.info('Copied to clipboard');
    });
  }

  downloadImage(id: any, name: any) {
    this.fileManagerService
      .downloadImage({ id: id })
      .then((data: any) => {
        this.fileSaverService.save(data, name);
      })
      .catch(() => {
        this.alertService.error('Unable to download trigger xlsx.');
      });
  }

  getImageById() {
    this.medialibraryService.imageById(this.editId).then(
      (data: any) => {
        this.showUploadButton = false;
        this.fileType = data.contentType;
        this.contentType = data;
        const ids = data.socialTags?.map((response: any) => {
          return response?.libraryTag?.id;
        });
        this.libraryForm.patchValue({
          tags: ids,
          file: data.location,
          isPrivate: data.isPrivate
        });
        this.croppedImage = data.location;
        this.details = data;
        this.isAddImageModalVisible = true;
      },
      () => {
        this.alertService.error('Unable to get library image.');
        this.isAddImageModalVisible = false;
      }
    );
  }

  createTag() {
    if (this.filtertedTagText.trim().length < 1) {
      this.alertService.error('please add valid tag');
      return;
    }
    const formData = { name: this.filtertedTagText, isFileManagerTag: true };
    console.log(formData);
    this.mediaTagService.create(formData).then(
      () => {
        this.filtertedTagText = '';
        this.alertService.success('Tag created successfully.');
        this.getTags();
      },
      (error: any) => {
        this.alertService.error(error.message);
      }
    );
  }

  cancelImagePopUp() {
    this.editId = null;
    this.isAddImageModalVisible = false;
    this.inputVariable.nativeElement.value = '';
    this.selectedTagModel = null;
    this.files = [];
  }

  removeImage() {
    this.croppedImage = '';
    this.selectedFile = null;
    this.imageChangedEvent = '';
    this.showUploadButton = true;
    if (this.myFileInput && this.myFileInput.nativeElement) {
      this.myFileInput.nativeElement.value = '';
    }
  }

  fileChangeEvent(event: any): void {
    console.log('file', event.srcElement.files[0].size / 1024 / 1024);
    this.selectedFile = event.srcElement.files[0];
    this.fileType = this.selectedFile.type;
    this.contentType['contentType'] = this.selectedFile.type;
    this.imageChangedEvent = event;
    this.showUploadButton = false;
    this.details.filename = this.selectedFile.name;
    this.croppedImage = this.selectedFile;
  }

  makeValueNull(event: any) {
    event.target.value = null;
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  fileBrowseHandler(files: any) {
    let invalidFormat = false;
    for (let i = 0; i < files.target.files.length; i++) {
      const file = files.target.files[i];
      var pattern = /image-*/;
      if (
        !file.type.match(pattern) &&
        !this.acceptable_types.includes(file.type)
      ) {
        invalidFormat = true;
      }
    }
    if (invalidFormat) {
      alert('Invalid format only supports images');
      return;
    }

    this.prepareFilesList(files.target.files);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
  }

  onFileDropped($event: any) {
    let invalidFormat = false;
    for (let i = 0; i < $event.length; i++) {
      const file = $event[i];
      var pattern = /image-*/;
      if (
        !file.type.match(pattern) &&
        !this.acceptable_types.includes(file.type)
      ) {
        invalidFormat = true;
      }
    }
    if (invalidFormat) {
      alert('Invalid format only supports images');
      return;
    }
    this.prepareFilesList($event);
  }

  setIsPrivate(data: any) {
    console.log(data);
  }

  submitForm() {
    if (this.libraryForm.invalid) {
      console.log('subitinvaliad');
      return;
    }
    const formData = new FormData();
    formData.append('tags', this.libraryForm.value.tags);
    formData.append('isPrivate', this.libraryForm.value.isPrivate);
    if (this.selectedFile) {
      const fileSizeInMB = this.selectedFile.size / (1024 * 1024); // Size in MB
      if (fileSizeInMB > 40) {
        this.alertService.error(
          'File size exceeds 40 MB limit. Please select a smaller file.'
        );
        return;
      }
      formData.append(
        'file',
        this.selectedFile
          ? this.selectedFile
          : this.imageUtilService.base64ToFile(this.croppedImage)
      );
      console.log('form', formData);
    }

    if (this.editId) {
      this.medialibraryService.update(this.editId, formData).then(
        () => {
          this.alertService.success('File updated successfully.');
          this.isAddImageModalVisible = false;
          this.selectedFile = null;
          this.getLibraries(
            this.pageSearchFilter,
            this.selectedTag,
            this.paginatorConfig.currentPage,
            this.paginatorConfig.noOfRecord
          );
          this.cancelImagePopUp();
        },
        () => {
          this.alertService.error('Unable to save the library');
        }
      );
    } else {
      const formDatas: any[] = [];

      for (let i = 0; i < this.files.length; i++) {
        const fileSizeInMB = this.files[i].size / (1024 * 1024); // Size in MB
        if (fileSizeInMB > 40) {
          this.alertService.error(
            'File size exceeds 40 MB limit. Please select a smaller file.'
          );
          return;
        }
      }

      for (let i = 0; i < this.files.length; i++) {
        const addFormData = new FormData();
        addFormData.append('tags', this.libraryForm.value.tags);
        addFormData.append('fileManagerFolderId', '2');
        addFormData.append('isPrivate', this.libraryForm.value.isPrivate);
        addFormData.append('file', this.files[i]);
        formDatas.push(this.medialibraryService.createPost(addFormData));
      }
      forkJoin(formDatas).subscribe(
        (res) => {
          console.log(res);
          this.alertService.success('File created successfully.');
          this.isAddImageModalVisible = false;
          this.files = [];
          this.getLibraries(
            this.pageSearchFilter,
            this.selectedTag,
            this.paginatorConfig.currentPage,
            this.paginatorConfig.noOfRecord
          );
          this.cancelImagePopUp();
        },
        (err) => {
          console.log('error', err);
          this.alertService.error('Unable to save the file');
        }
      );
    }
  }
}
