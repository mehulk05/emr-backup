import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ConvertImageService } from 'src/app/shared/services/image-utils/convertImage.service';
import { PostLibraryService } from '../../../services/post-library.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';

@Component({
  selector: 'app-add-edit-calendar-post',
  templateUrl: './add-edit-calendar-post.component.html',
  styleUrls: ['./add-edit-calendar-post.component.css']
})
export class AddEditCalendarPostComponent implements OnInit, OnChanges {
  showModalForImage = false;
  libId: any = null;
  @Input() showModal: any = true;
  @Input() calendarArgs: any;
  @ViewChild('myFileInput') myFileInput: any;
  @Output() modalClosed = new EventEmitter<any>();
  @ViewChild('modal') modal: any;
  formTitle: string;
  socialMediaForm!: FormGroup;
  startDate: Date;
  postLabels: any = [];
  socialProfiles: any = [];
  isSocialProfileExists: boolean = true;
  showUploadButton: boolean = true;
  croppedImage: any;
  imageChangedEvent: any = '';
  postId: any;
  localTimezone: string;
  uploadPost: boolean = true;
  showAiImageModal = false;
  isAiImageSelected = false;
  isApproved = false;
  isPosted = false;

  constructor(
    private alertService: ToasTMessageService,
    private socialMediaService: PostLibraryService,
    private formBuilder: FormBuilder,
    private imageUtilService: ConvertImageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPostLabels();
    this.loadSocialProfiles();
  }

  initForm() {
    this.socialMediaForm = this.formBuilder.group({
      name: ['', []],
      hashtag: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.hashtag)]
      ],
      post: ['', []],
      isDefault: [false, []],
      file: ['', []],
      files: ['', []],
      socialMediaPostLabelId: [[], [Validators.required]],
      scheduledDate: [this.startDate ? this.startDate : new Date()],
      socialProfileIds: [[], [Validators.required]]
    });
  }

  loadPostLabels() {
    this.socialMediaService.getLabels().then(
      (response: any) => {
        this.postLabels = response;
      },
      () => {
        this.alertService.error('Error while fetching labels');
      }
    );
  }

  loadSocialProfiles() {
    this.socialMediaService.loadSocialProfiles().then(
      (response: any) => {
        this.socialProfiles = response;
        if (response.length == 0) {
          this.isSocialProfileExists = false;
        }
      },
      () => {
        this.alertService.error('Unable to load Social profiles.');
      }
    );
    this.localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  ngOnChanges(): void {
    this.formTitle = 'Add Post';
    console.log(this.calendarArgs);
    this.postId = this.calendarArgs?.data?.Id;
    if (this.postId) {
      this.formTitle = 'Edit Post';
      this.loadPostData();
    }
  }

  loadPostData() {
    this.socialMediaService.getPostDataById(this.postId).then(
      (response: any) => {
        console.log('aproveeed', response);
        const labelId: any[] = [];
        if (response.postLabels != null) {
          response.postLabels.forEach((postLabel: any) => {
            labelId.push(postLabel.socialMediaPostLabel?.id);
          });
        }
        const socialProfilesSelected: any[] = [];
        if (response.socialProfiles != null) {
          response.socialProfiles.forEach((socialProfile: any) => {
            socialProfilesSelected.push(socialProfile.id);
          });
        }

        let date = new Date();
        if (response.scheduledDate != null) {
          date = moment(response.scheduledDate).toDate();
        }
        this.socialMediaForm.patchValue({
          socialProfileIds: socialProfilesSelected,
          socialMediaPostLabelId: labelId,
          scheduledDate: date,
          name: response?.name,
          hashtag: response?.hashtag,
          isDefault: response?.isDefault ?? false,
          post: response?.post
        });
        this.isApproved = response.approved;
        this.isPosted = response.sent;
        if (response.socialMediaPostImages.length > 0) {
          this.showUploadButton = false;
          this.croppedImage = response.socialMediaPostImages[0].location;
        }
      },
      () => {
        this.alertService.error('Unable to load post details !!');
      }
    );
  }

  hideModal(flag?: boolean) {
    this.showModal = false;
    if (flag) {
      this.modalClosed.emit(true);
    } else {
      this.modalClosed.emit(false);
    }
  }

  submitForm() {
    console.log(this.socialMediaForm.value);
    if (this.socialMediaForm.invalid) {
      return;
    }
    console.log('log', this.croppedImage);
    // if (
    //   this.croppedImage === '' ||
    //   this.croppedImage === null ||
    //   this.croppedImage === undefined
    // ) {
    //   this.uploadPost = false;
    //   return;
    // }
    this.showModal = false;
    const formData = new FormData();
    formData.append('name', this.socialMediaForm.value.name);
    formData.append('hashtag', this.socialMediaForm.value.hashtag);
    formData.append('label', this.socialMediaForm.value.label);
    formData.append('post', this.socialMediaForm.value.post);

    if (this.libId) {
      formData.append('libId', this.libId);
    }

    formData.append(
      'socialMediaPostLabelId',
      this.socialMediaForm.value.socialMediaPostLabelId.join(',')
    );
    const m = moment(this.socialMediaForm.value.scheduledDate);
    formData.append('scheduledDate', m.format('YYYY-MM-DD HH:mm:00 ZZ'));
    formData.append(
      'socialProfileIds',
      this.socialMediaForm.value.socialProfileIds
    );
    if (this.croppedImage && !this.croppedImage.startsWith('http')) {
      formData.append(
        'files',
        this.imageUtilService.base64ToFile(this.croppedImage)
      );
    }

    if (this.croppedImage && this.croppedImage.startsWith('http')) {
      if (this.isAiImageSelected) {
        formData.append('aiImageUrls', this.croppedImage);
      }
    }

    if (this.postId) {
      this.socialMediaService.updatePost(this.postId, formData).then(
        () => {
          this.alertService.success('Social media post updated successfully.');
          this.hideModal(true);
        },
        () => {
          this.alertService.error('Unable to save the post');
        }
      );
    } else {
      this.socialMediaService.createPost(formData).then(
        () => {
          this.alertService.success('Social media post created successfully.');
          this.hideModal(true);
        },
        () => {
          this.alertService.error('Unable to create the post');
        }
      );
    }
  }

  get f() {
    return this.socialMediaForm.controls;
  }

  fileChangeEvent(event: any): void {
    this.isAiImageSelected = false;
    this.libId = null;
    this.imageChangedEvent = event;
    this.showUploadButton = false;
    this.imageUtilService.convertImageToBase64(event);
    setTimeout(() => {
      this.croppedImage = this.imageUtilService.imageBase64;
    }, 500);
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  deleteImage() {
    this.croppedImage = '';
    this.imageChangedEvent = '';
    this.showUploadButton = true;
    if (this.myFileInput && this.myFileInput.nativeElement) {
      this.myFileInput.nativeElement.value = '';
    }
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

  afterImageSelection(data: any) {
    this.isAiImageSelected = false;
    this.showModalForImage = false;
    if (data) {
      this.croppedImage = data.location;
      this.showUploadButton = false;
      this.libId = data.id;
    }
  }

  uploadImageFromLibrary() {
    this.showModalForImage = true;
  }

  aiModelClose(event: any) {
    console.log('event' + event);
    this.showAiImageModal = false;
  }

  generateImageFromAi() {
    this.showAiImageModal = true;
  }

  getSelectedAiImage(event: any) {
    this.isAiImageSelected = true;
    this.showAiImageModal = false;
    if (event) {
      this.croppedImage = event;
      this.showUploadButton = false;
    }
  }
}
