import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FolderManagementService } from '../../services/folder-management.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConvertImageService } from 'src/app/shared/services/image-utils/convertImage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-add-edit-media-file',
  templateUrl: './add-edit-media-file.component.html',
  styleUrls: ['./add-edit-media-file.component.css']
})
export class AddEditMediaFileComponent implements OnInit, OnChanges {
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
  libraryForm: FormGroup;
  @Input() editId: any;
  @Output() afterModalClose = new EventEmitter<any>();

  @Input() folderId: any;
  @Input() showAddFilesModal: boolean = false;
  uploadPost: boolean = true;
  selectedFile: any;
  croppedImage: string;
  files: any = [];
  fileType: any;
  contentType: any;
  details: any;
  imageChangedEvent: string;
  showUploadButton: boolean;
  myFileInput: any;
  isAddImageModalVisible: boolean;
  previewModelShow: boolean;
  tagSelect: boolean;
  selectedTag: any;
  tags: any;
  filtertedTagText: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private imageUtilService: ConvertImageService,
    private router: Router,
    private fileService: FolderManagementService,
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService
  ) {}

  ngOnChanges(): void {
    if (this.editId) {
      this.loadFileModalDataById();
    }
  }

  ngOnInit(): void {
    this.libraryForm = this.formBuilder.group({
      file: ['', []],
      tags: ['', [Validators.required]],
      isPrivate: [false, [Validators.required]]
    });
    this.getMediaTagList();
  }

  loadFileModalDataById() {
    this.fileService.imageById(this.editId).then(
      (data: any) => {
        this.showUploadButton = false;
        this.fileType = data.contentType;
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
        this.contentType = data;
      },
      () => {
        this.alertService.error('Unable to get library image.');
      }
    );
  }

  getMediaTagList() {
    this.fileService.socialMediaTagList().then(
      (response: any) => {
        this.tags = response;
      },
      (error: { message: string }) => {
        this.alertService.error(error.message);
      }
    );
  }

  onTagSelect(e: any) {
    this.selectedTag = e.value;
    console.log('selected', this.selectedTag);
    if (this.selectedTag.length === 0) {
      this.tagSelect = true;
    } else {
      this.tagSelect = false;
    }
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
    const formData = { name: this.filtertedTagText, isFileManagerTag: true };
    console.log(formData);
    this.fileService.createTag(formData).then(
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

  submitForm() {
    console.log(this.libraryForm.value);

    const formData = new FormData();
    formData.append('tags', this.libraryForm.value.tags);
    formData.append('isPrivate', this.libraryForm.value.isPrivate);
    formData.append('fileManagerFolderId', this.folderId);
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
      this.fileService.updateFile(this.editId, formData).then(
        () => {
          this.alertService.success('File updated successfully.');
          this.afterModalClose.emit({ type: 'Submit' });
        },
        () => {
          this.alertService.error('Unable to save the library');
        }
      );
    } else {
      const uploadPromises = this.files.map((file: any) => {
        const addFormData = new FormData();
        addFormData.append('tags', this.libraryForm.value.tags);
        addFormData.append('isPrivate', this.libraryForm.value.isPrivate);
        addFormData.append('fileManagerFolderId', this.folderId);
        addFormData.append('file', file);

        console.log(addFormData);

        return this.fileService.addFilesToFolder(addFormData);
      });
      Promise.all(uploadPromises)
        .then((results) => {
          console.log(results);
          this.afterModalClose.emit({ type: 'Submit' });
        })
        .catch((error) => {
          // Handle error if any file upload fails
          console.error('File upload failed:', error);
        });
    }
  }

  makeValueNull(event: any) {
    event.target.value = null;
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
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
    console.log(this.selectedFile);
    this.croppedImage = this.selectedFile;
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
    console.log(files);
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

  get f() {
    return this.libraryForm.controls;
  }
  closeModal() {
    this.afterModalClose.emit({ type: 'Close' });
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

  preview() {
    this.isAddImageModalVisible = false;
    this.previewModelShow = true;
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
}
