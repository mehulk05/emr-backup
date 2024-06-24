import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ConvertImageService } from 'src/app/shared/services/image-utils/convertImage.service';
import { MedialibraryService } from '../../services/medialibrary.service';
import { MediaTagService } from '../../services/media-tag.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-library',
  templateUrl: './add-library.component.html',
  styleUrls: ['./add-library.component.css']
})
export class AddLibraryComponent implements OnInit {
  files: any[] = [];
  libraryForm!: FormGroup;
  id: any;
  @ViewChild('myFileInput') myFileInput: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  @ViewChild('myform') myform: ElementRef<HTMLElement>;
  labels: any = [];
  todayDate = new Date();
  socialProfiles: any = [];
  approvedPost: boolean = false;
  selectedTag: any;
  tagSelect: boolean;
  selectedFile: File;
  showUploadButton: boolean = true;
  isSocialProfileExists: boolean = true;
  fileSizeValid: boolean = true;
  uploadPost: boolean = true;
  localTimezone: string;
  tags: any[] = [];
  filtertedTagText = '';
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private medialibraryService: MedialibraryService,
    private imageUtilService: ConvertImageService,
    private mediaTagService: MediaTagService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.id = data?.id;
      if (this.id) {
        this.getImageById();
      }
    });
    this.libraryForm = this.formBuilder.group({
      tags: ['', [Validators.required]],
      file: ['', []]
    });

    this.getMediaTagList();
  }

  getImageById() {
    this.medialibraryService.imageById(this.id).then(
      (data: any) => {
        this.showUploadButton = false;
        const ids = data.socialTags?.map((response: any) => {
          return response?.libraryTag?.id;
        });
        this.libraryForm.patchValue({
          tags: ids,
          file: data.location
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
    if (this.croppedImage && !this.croppedImage.startsWith('http')) {
      formData.append(
        'file',
        this.selectedFile
          ? this.selectedFile
          : this.imageUtilService.base64ToFile(this.croppedImage)
      );
      console.log('form', formData);
    }

    if (this.id) {
      this.medialibraryService.update(this.id, formData).then(
        () => {
          this.alertService.success(
            'Social media library updated successfully.'
          );
          this.goBack();
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
        formDatas.push(this.medialibraryService.createPost(addFormData));
      }
      forkJoin(formDatas).subscribe(
        (res) => {
          console.log(res);
          this.alertService.success(
            'Social media library created successfully.'
          );
          this.goBack();
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
    this.mediaTagService.fileManagerTagList().then(
      (response: any) => {
        this.tags = response;
      },
      (error) => {
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

  goBack() {
    this.router.navigate(['/media/library']);
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
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
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
}
