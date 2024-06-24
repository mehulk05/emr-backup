import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { MediaTagService } from '../services/media-tag.service';
import { MedialibraryService } from '../services/medialibrary.service';
import { FileSaverService } from 'ngx-filesaver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvertImageService } from 'src/app/shared/services/image-utils/convertImage.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-social-media-library',
  templateUrl: './social-media-library.component.html',
  styleUrls: ['./social-media-library.component.css']
})
export class SocialMediaLibraryComponent implements OnInit {
  acceptable_types = [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  pageSearchFilter: any = '';
  @ViewChild('fileDropRef') inputVariable: ElementRef;

  selectedIndex: any = 0;
  sources = ['myWebsite', 'Libary'];
  source: any = 'myWebsite';
  websiteLink: any;
  landingPageLibraryLink: any;
  modifiedTemplates: any = [];
  libraries: any = [];
  libraryTemplates: any = [];
  landingPages: any;
  @ViewChild('myFileInput') myFileInput: any;
  isAddImageModalVisible = false;
  files: any[] = [];
  libraryForm!: FormGroup;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  labels: any = [];
  todayDate = new Date();
  socialProfiles: any = [];
  approvedPost: boolean = false;
  tagSelect: boolean;
  selectedFile: File;
  showUploadButton: boolean = true;
  isSocialProfileExists: boolean = true;
  fileSizeValid: boolean = true;
  uploadPost: boolean = true;
  localTimezone: string;
  tags: any[] = [];
  filtertedTagText = '';
  selectedTagModel: any = '';
  editId: any;
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
    'location',
    'filename',
    'socialTags',
    'actions',
    'createdBy',
    'updatedBy',
    'updatedAt',
    'createdAt'
  ];
  columns = [
    { header: 'Id', field: 'id', order: 1 },
    { header: 'Image', field: 'location', order: 2 },
    { header: 'File Name', field: 'filename', order: 3 },
    { header: 'Tags', field: 'socialTags', order: 4 },
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
    { header: 'Image', field: 'location', order: 2 },
    { header: 'File Name', field: 'filename', order: 3 },
    { header: 'Tags', field: 'socialTags', order: 4 },
    { header: 'Actions', field: 'actions', order: 5 }
  ];

  constructor(
    private router: Router,
    private medialibraryService: MedialibraryService,
    private alertService: ToasTMessageService,
    private mediaTagService: MediaTagService,
    public formatTimeService: FormatTimeService,
    public fileSaverService: FileSaverService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private imageUtilService: ConvertImageService
  ) {}

  ngOnInit(): void {
    this.getLibraries(
      this.pageSearchFilter,
      this.selectedTag,
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
    this.getTags();
    this.libraryForm = this.formBuilder.group({
      tags: ['', [Validators.required]],
      file: ['', []],
      isPrivate: ['', []]
    });

    this.getMediaTagList();
  }

  @Input()
  set selectedColumns(selectedColumns: any) {
    this._selectedColumns = selectedColumns;
    this._selectedColumns.sort((a: any, b: any) => a.order - b.order);
  }

  get selectedColumns(): any {
    return this._selectedColumns;
  }

  getImageById() {
    this.medialibraryService.imageById(this.editId).then(
      (data: any) => {
        this.showUploadButton = false;
        const ids = data.socialTags?.map((response: any) => {
          return response?.libraryTag?.id;
        });
        this.libraryForm.patchValue({
          tags: ids,
          file: data.location,
          isPrivate: data.isPrivate
        });
        this.croppedImage = data.location;
      },
      () => {
        this.alertService.error('Unable to get library image.');
      }
    );
  }

  get f() {
    return this.libraryForm.controls;
  }

  imageCropped(event: any) {
    console.log(event);
    this.croppedImage = event.base64;
    //  console.log(this.croppedImage);
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  fileChangeEvent(event: any): void {
    console.log('file', event.srcElement.files[0].size / 1024 / 1024);
    this.selectedFile = event.srcElement.files[0];
    this.imageChangedEvent = event;
    this.showUploadButton = false;
    this.imageUtilService.convertImageToBase64(event);
    setTimeout(() => {
      this.croppedImage = this.imageUtilService.imageBase64;
    }, 500);
  }
  //this.croppedImage = event.base64;
  // /}

  removeImage() {
    this.croppedImage = '';
    this.selectedFile = null;
    this.imageChangedEvent = '';
    this.showUploadButton = true;
    if (this.myFileInput && this.myFileInput.nativeElement) {
      this.myFileInput.nativeElement.value = '';
    }
  }
  makeValueNull(event: any) {
    event.target.value = null;
  }

  submitForm() {
    if (this.libraryForm.invalid) {
      console.log('subitinvaliad');
      return;
    }
    const formData = new FormData();
    formData.append('tags', this.libraryForm.value.tags);
    formData.append('isPrivate', this.libraryForm.value.isPrivate);
    if (this.croppedImage && !this.croppedImage.startsWith('http')) {
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
          this.alertService.success(
            'Social media library updated successfully.'
          );
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
        const addFormData = new FormData();
        addFormData.append('tags', this.libraryForm.value.tags);
        addFormData.append('file', this.files[i]);
        formDatas.push(
          this.medialibraryService.createSocialMediaImagePost(addFormData)
        );
      }
      forkJoin(formDatas).subscribe(
        (res) => {
          console.log(res);
          this.alertService.success(
            'Social media library created successfully.'
          );
          this.cancelImagePopUp();
          this.getLibraries(
            this.pageSearchFilter,
            this.selectedTag,
            this.paginatorConfig.currentPage,
            this.paginatorConfig.noOfRecord
          );
        },
        (err) => {
          console.log('error', err);
          this.alertService.error(
            'Unable to save the image, as the file size more than 1 MB'
          );
        }
      );
    }
  }

  getMediaTagList() {
    this.mediaTagService.socialMediaTagList().then(
      (response: any) => {
        this.tags = response;
      },
      (error) => {
        this.alertService.error(error.message);
      }
    );
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

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    let invalidFormat = false;
    for (let i = 0; i < $event.length; i++) {
      const file = $event[i];
      var pattern = /image-*/;
      if (!file.type.match(pattern)) {
        invalidFormat = true;
      }
    }
    if (invalidFormat) {
      alert('Invalid format only supports images');
      return;
    }
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any) {
    let invalidFormat = false;
    for (let i = 0; i < files.target.files.length; i++) {
      const file = files.target.files[i];
      var pattern = /image-*/;
      if (!file.type.match(pattern)) {
        invalidFormat = true;
      }
    }
    if (invalidFormat) {
      alert('Invalid format only supports images');
      return;
    }

    this.prepareFilesList(files.target.files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    console.log(index);
    // setTimeout(() => {
    //   if (index === this.files.length) {
    //     return;
    //   } else {
    //     const progressInterval = setInterval(() => {
    //       if (this.files[index].progress === 100) {
    //         clearInterval(progressInterval);
    //         this.uploadFilesSimulator(index + 1);
    //       } else {
    //         this.files[index].progress += 5;
    //       }
    //     }, 200);
    //   }
    // }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
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

  onFilter(data: any) {
    console.log(data.filter);
    this.filtertedTagText = data.filter;
  }

  createTag() {
    if (this.filtertedTagText.trim().length < 1) {
      this.alertService.error('please add valid tag');
      return;
    }
    const formData = { name: this.filtertedTagText, isFileManagerTag: false };
    console.log(formData);
    this.mediaTagService.create(formData).then(
      () => {
        this.filtertedTagText = '';
        this.alertService.success('Tag created successfully.');
        this.getMediaTagList();
      },
      (error: any) => {
        this.alertService.error(error.message);
      }
    );
  }

  getLibraries(search: string, tag: string, page?: number, size?: number) {
    this.medialibraryService.getLibraries(search, tag, page, size).then(
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
    this.isAddImageModalVisible = true;
    // this.router.navigate(['media/library/add']);
  }

  addTag() {
    this.router.navigate(['media/library/addTag'], {
      queryParams: { page: 'MEDIA' }
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
      .socialMediaTagList()
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
      this.medialibraryService.deleteLibraryById(data).then(
        () => {
          this.alertService.success('Image deleted successfully');
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
    this.editId = data;
    this.isAddImageModalVisible = true;
    if (this.editId) {
      this.getImageById();
    }
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

  getTag(tag: any) {
    return tag?.map((response: any) => {
      return response?.libraryTag?.name;
    });
  }

  isImage(data: any) {
    return !this.acceptable_types.includes(data.contentType);
  }

  downloadImage(imageLink: any, name: any) {
    this.medialibraryService
      .downloadImage({ imageLink: imageLink })
      .then((data: any) => {
        this.fileSaverService.save(data, name);
      })
      .catch(() => {
        this.alertService.error('Unable to download trigger xlsx.');
      });
  }

  cancelImagePopUp() {
    console.log('closed');
    this.editId = null;
    this.isAddImageModalVisible = false;
    this.selectedTagModel = null;
    this.files = [];
  }
}
