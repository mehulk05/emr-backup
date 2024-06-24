import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import moment from 'moment';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ConvertImageService } from 'src/app/shared/services/image-utils/convertImage.service';
import { PostLibraryService } from '../../services/post-library.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';

@Component({
  selector: 'app-add-edit-post',
  templateUrl: './add-edit-post.component.html',
  styleUrls: ['./add-edit-post.component.css']
})
export class AddEditPostComponent implements OnInit, OnDestroy {
  showModalForImage = false;
  showModalForImageUpload = false;
  socialMediaForm!: FormGroup;
  id: any;
  @ViewChild('myFileInput') myFileInput: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  @ViewChild('myform') myform: ElementRef<HTMLElement>;
  labels: any = [];
  todayDate = new Date();
  socialProfiles: any = [];
  approvedPost: boolean = false;
  isAiImageSelected = false;

  showUploadButton: boolean = true;
  isSocialProfileExists: boolean = true;
  fileSizeValid: boolean = true;
  uploadPost: boolean = true;
  localTimezone: string;
  libId: any = null;
  showAiImageModal = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private socialMediaService: PostLibraryService,
    private imageUtilService: ConvertImageService
  ) {}

  ngOnInit(): void {
    if (!this.libId) {
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
        scheduledDate: [this.todayDate ? this.todayDate : new Date()],
        socialProfileIds: [[], [Validators.required]]
      });

      this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
        this.id = params.get('id');
        if (this.id) {
          this.loadSocialMedia();
        } else {
        }
      });
      this.loadLabels();
      this.loadSocialProfiles();
      this.getSelectedImage();
    }
  }
  get f() {
    return this.socialMediaForm.controls;
  }
  loadSocialProfiles(): void {
    this.socialMediaService.socialProfilelist().then(
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

  checkScheduleDate(mydate: any, post: any) {
    var q = new Date();
    var date = new Date(q.getFullYear(), q.getMonth(), q.getDate());
    console.log('date', mydate);
    const scheduledDate = moment(mydate).format('DD-MM-YYYY');
    const currentDate = moment(date).format('DD-MM-YYYY');
    var checkDate = false;
    if (currentDate >= scheduledDate) {
      checkDate = false;
      //alert('Current Date is Greater THan the User Date');
    } else {
      checkDate = true;
      //alert('Current Date is Less than the User Date');
    }
    console.log('checl', checkDate, post);
    if (checkDate) {
      this.approvedPost = false;
    } else {
      this.approvedPost = true;
      if (!post) {
        this.approvedPost = false;
      }
    }

    if (post) {
      this.approvedPost = true;
    }
  }

  loadSocialMedia() {
    this.socialMediaService.get(this.id).then((response: any) => {
      console.log('reponse', response);
      this.socialMediaForm.patchValue(response);
      this.checkScheduleDate(response.scheduledDate, response.approved);
      const labelId: any[] = [];
      if (response.postLabels != null) {
        response.postLabels.forEach((postLabel: any) => {
          labelId.push(postLabel.socialMediaPostLabel.id);
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

      if (response != null && response.socialMediaPostImages.length > 0) {
        this.croppedImage = response.socialMediaPostImages[0].location;
        this.showUploadButton = false;
      }
      if (response.socialMediaPostImages.length === 0) {
        this.showUploadButton = true;
      } else {
        this.showUploadButton = false;
      }
    });
  }

  loadLabels() {
    this.socialMediaService.labellist().then(
      (response: any) => {
        console.log(this.labels);
        this.labels = response;
        //console.log(this.labels);
      },
      (error: any) => {
        this.alertService.error(error.message);
      }
    );
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
    this.isAiImageSelected = false;
    this.libId = null;
    console.log('file', event.srcElement.files[0].size / 1024 / 1024);
    //const imageSize = event.srcElement.files[0].size / 1024 / 1024;
    // if (imageSize > 1) {
    //   this.fileSizeValid = false;
    //   console.log('filez', this.fileSizeValid);
    // } else {
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
    this.imageChangedEvent = '';
    this.showUploadButton = true;
    if (this.myFileInput && this.myFileInput.nativeElement) {
      this.myFileInput.nativeElement.value = '';
    }
  }
  makeValueNull(event: any) {
    event.target.value = null;
  }

  uploadImageFromLibrary() {
    this.showModalForImage = true;
  }

  submitForm() {
    if (this.socialMediaForm.invalid) {
      console.log('subitinvaliad');
      return;
    }
    // if (this.croppedImage === '') {
    //   this.uploadPost = false;
    //   return;
    // }
    const formData = new FormData();
    formData.append('name', this.socialMediaForm.value.name);
    formData.append('hashtag', this.socialMediaForm.value.hashtag);
    formData.append('label', '');
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
      console.log('form', formData);
    }

    if (this.croppedImage && this.croppedImage.startsWith('http')) {
      if (this.isAiImageSelected) {
        formData.append('aiImageUrls', this.croppedImage);
      }
    }

    if (this.id) {
      this.socialMediaService.updatePost(this.id, formData).then(
        () => {
          this.alertService.success('Social media post updated successfully.');
          this.goBack();
        },
        () => {
          this.alertService.error('Unable to save the post');
        }
      );
    } else {
      this.socialMediaService.createPost(formData).then(
        () => {
          this.alertService.success('Social media post created successfully.');
          this.goBack();
        },
        () => {
          this.alertService.error('Unable to create the post');
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['/post-library']);
  }

  getSelectedImage() {
    this.socialMediaService.getImage().subscribe((data: any) => {
      if (data) {
        this.croppedImage = data.location;
        this.showUploadButton = false;
        this.libId = data.id;
      }
    });
  }

  afterImageSelection(data: any) {
    this.isAiImageSelected = false;
    this.showModalForImageUpload = false;
    if (data) {
      this.croppedImage = data.location;
      this.showUploadButton = false;
      this.libId = data.id;
    }
  }

  ngOnDestroy() {
    this.socialMediaService.selectImage(null);
  }

  cancelImageUpload() {
    this.showModalForImageUpload = false;
    this.myFileInput.nativeElement.value = '';
  }

  handleImageUpload(event: any) {
    this.showUploadButton = false;
    this.isAiImageSelected = false;

    const fileInput = event.target;
    const imageFile = fileInput.files[0];
    console.log(imageFile);
    if (imageFile) {
      const reader = new FileReader();

      const componentReference = this;
      reader.onload = function (e) {
        const img: any = new Image();
        img.src = e.target.result;
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate the new dimensions to make it 600px width while maintaining 1:1 aspect ratio
          const aspectRatio = 1 / 1; // 1:1 aspect ratio
          const newWidth = 600;
          const newHeight = 600 * aspectRatio;

          canvas.width = newWidth;
          canvas.height = newHeight;

          // Fill with a white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw the resized image
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // Convert the canvas content back to a data URL
          const resizedImageDataURL = canvas.toDataURL('image/jpeg');
          console.log(resizedImageDataURL);
          componentReference.croppedImage = resizedImageDataURL;
        };
      };

      reader.readAsDataURL(imageFile);
    }
    console.log(this.croppedImage);
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
