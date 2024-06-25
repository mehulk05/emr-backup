import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ConvertImageService } from 'src/app/shared/services/image-utils/convertImage.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { RolesService } from 'src/app/shared/services/roles.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { SetPublicUserId } from 'src/app/shared/store-management/store/general-states/general-state.action';
import { UserService } from '../../services/user.service';
import { LandingPageService } from 'src/app/modules/landing-page/service/landing-page.service';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userTitle = 'My Profile';
  isLoggedInUser: boolean = false;
  activatedRouteUserId: any = null;
  quickLinkData: any;
  @ViewChild('myFileInput') myFileInput: any;
  isImageUploading: boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  userForm!: FormGroup;
  roles: any = [];
  showAiModal = false;
  aiContent = '';
  clinicList: any = [];
  servicesList: any = [];
  serviceCategory: any = [];
  currenUserSubscription: any;
  showResetPassword: any = false;
  showSaveButton: any = true;
  userId: any = null;
  providerId: any = null;
  userData: any;
  username: any;
  loggedInUserRoles: any;
  businessId: any;
  isProvider: boolean = false;
  profileImageUrl: any =
    'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';
  showModalForImage: boolean = false;
  isMobileDevice: boolean = false;
  loggedInUserId: any;
  currentSupportUser: boolean = false;
  isSupportUser: boolean = false;
  noUserData: boolean = false;
  editUser: boolean = true;
  showModalForTemplate = false;
  message = '';
  category = 'Correct this to standard English';
  totalCharacterLength = 200;
  constructor(
    public formBuilder: FormBuilder,
    private roleService: RolesService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToasTMessageService,
    private userService: UserService,
    private localStorgaeService: LocalStorageService,
    private authService: AuthService,
    private convertImageService: ConvertImageService,
    private router: Router,
    private store: Store,
    private landingPage: LandingPageService
  ) {}
  ngOnInit(): void {
    this.onResize();
    this.getLandingPageCount();
    this.userId = this.activatedRoute.snapshot.params.userId;
    if (this.userId === '0') {
      this.editUser = true;
    } else {
      this.editUser = false;
    }
    this.initalizeUserForm();
    const currentUser = this.localStorgaeService.readStorage('currentUser');
    if (currentUser != null && currentUser.supportUser) {
      this.isSupportUser = true;
    }
    this.loggedInUserId = currentUser?.id;

    if (
      currentUser != null &&
      currentUser.supportUser &&
      currentUser.supportUser != 'false' &&
      this.userId
    ) {
      this.showResetPassword = true;
    }

    if (
      currentUser != null &&
      currentUser.supportUser &&
      currentUser.supportUser != 'false' &&
      !this.userId
    ) {
      this.showSaveButton = false;
    }

    this.loadRoles();
    if (this.userId) {
      this.loadClinics();
      this.businessId = currentUser?.businessId;
      /* ---------------- IF USER ID  is 0 it Means creating a new User ---------------- */
      //this.loadUser();
      if (this.userId == 0) {
        this.userId = null;
        this.userTitle = 'Create User';
      } else {
        this.loadUser(true);
      }
    } else {
      if (!currentUser) {
        this.currenUserSubscription =
          this.authService.currentUserSubject.subscribe((data: any) => {
            if (data) {
              this.userId = data?.id;
              this.providerId = this.userId;
              this.businessId = data?.businessId;
              this.loadUser();
            } else {
              this.authService.logout();
            }
          });
      } else {
        this.userId = currentUser?.id;
        this.providerId = this.userId;
        this.businessId = currentUser?.businessId;
        this.loadUser();
        this.loadClinics();
      }
    }
  }

  initalizeUserForm() {
    if (this.isProvider) {
      this.localStorgaeService.storeItem('newUser', this.userForm.value);
      this.userForm = this.formBuilder.group({
        firstName: [
          '',
          [Validators.required, Validators.pattern(RegexEnum.textFeild)]
        ],
        lastName: [
          '',
          [Validators.required, Validators.pattern(RegexEnum.textFeild)]
        ],
        email: ['', [Validators.required, Validators.pattern(RegexEnum.email)]],
        phone: [
          '',
          [Validators.required, Validators.pattern(RegexEnum.mobile)]
        ],
        roleId: ['', [Validators.required]],
        designation: ['', []],
        timezone: ['', []],
        clinicIds: [[], [Validators.required]],
        serviceCategoryIds: [[], [Validators.required]],
        serviceIds: [[], [Validators.required]],
        isProvider: [true, []],
        description: ['', [Validators.maxLength(200)]],
        isSmsOptedIn: [true, []]
      });
      const newUser = this.localStorgaeService.readStorage('newUser');
      this.userForm.patchValue({
        firstName: newUser?.firstName,
        lastName: newUser?.lastName,
        email: newUser?.email,
        phone: newUser?.phone,
        roleId: newUser?.roleId,
        designation: newUser.designation,
        timezone: this.userForm.value?.timezone,
        serviceCategoryIds: this.userForm.value?.serviceCategoryIds,
        serviceIds: this.userForm.value?.serviceIds,
        clinicIds: this.userForm.value.clinicIds,
        isProvider: this.userForm.value?.isProvider,
        description: this.userForm.value?.description,
        isSmsOptedIn: newUser?.isSmsOptedIn
      });
      if (this.userForm.value?.description) {
        this.userForm.patchValue({
          description: this.userForm.value?.description
        });
      } else {
        this.userForm.patchValue({
          description: newUser.description
        });
      }
    } else {
      if (this.userForm?.value !== undefined && this.userForm?.value !== null) {
        this.noUserData = true;
      }
      if (this.noUserData) {
        this.localStorgaeService.storeItem('newUser', this.userForm?.value);
      }
      this.userForm = this.formBuilder.group({
        firstName: [
          '',
          [Validators.required, Validators.pattern(RegexEnum.textFeild)]
        ],
        lastName: [
          '',
          [Validators.required, Validators.pattern(RegexEnum.textFeild)]
        ],
        email: ['', [Validators.required, Validators.pattern(RegexEnum.email)]],
        phone: [
          '',
          [Validators.required, Validators.pattern(RegexEnum.mobile)]
        ],
        roleId: ['', [Validators.required]],
        designation: ['', []],
        timezone: ['', []],
        clinicIds: [[], []],
        serviceCategoryIds: [[], []],
        serviceIds: [[], []],
        isProvider: [false, []],
        description: ['', [Validators.maxLength(200)]],
        isSmsOptedIn: [true, []]
      });
      if (this.noUserData) {
        const newUser = this.localStorgaeService.readStorage('newUser');
        this.userForm.patchValue({
          firstName: newUser?.firstName,
          lastName: newUser?.lastName,
          email: newUser?.email,
          phone: newUser?.phone,
          roleId: newUser?.roleId,
          designation: newUser.designation,
          timezone: this.userForm.value?.timezone,
          isProvider: this.userForm.value?.isProvider,
          description: this.userForm.value?.description,
          isSmsOptedIn: newUser?.isSmsOptedIn
        });
        if (this.userForm.value?.description) {
          this.userForm.patchValue({
            description: this.userForm.value?.description
          });
        } else {
          this.userForm.patchValue({
            description: newUser.description
          });
        }
      }
    }
  }

  updateUserForm(response: any) {
    /* ----------------------------- laod all the id ---------------------------- */
    this.userData = response;
    const clinicIds = this.getIds(response.clinics);
    const serviceIds = this.getIds(response.services);
    const serviceCategoryIds = this.getIds(response.userServiceCategories);

    if (response?.isProvider && clinicIds && clinicIds.length > 0) {
      this.loadClinicCategoryService(clinicIds);
    }
    if (
      response?.isProvider &&
      serviceCategoryIds &&
      serviceCategoryIds.length > 0
    ) {
      this.loadServiceByCategory(serviceCategoryIds);
    }
    /* ---------------------------- patch form start ---------------------------- */
    this.userForm.patchValue({
      firstName: response?.firstName,
      lastName: response?.lastName,
      email: response?.email,
      phone: response?.phone,
      roleId: response?.roles.id,
      designation: response?.designation,
      timezone: response?.timezone,
      serviceCategoryIds: serviceCategoryIds,
      serviceIds: serviceIds,
      clinicIds: clinicIds,
      isProvider: response?.isProvider,
      description: response?.description,
      isSmsOptedIn: response?.isSmsOptedIn
    });

    this.isProvider = response?.isProvider;
  }

  loadUser(isEditUser?: boolean) {
    this.userService
      .getOptimziedUser(this.userId)
      .then((response: any) => {
        const providerInfo =
          this.localStorgaeService.readStorage('providerInfo') || {};

        providerInfo[this.userId] = response;
        this.localStorgaeService.storeItem('providerInfo', providerInfo);

        this.quickLinkData = response?.headerMenu;

        const currentUser = this.localStorgaeService.readStorage('currentUser');
        var userResp: any = {
          firstName: response.firstName,
          lastName: response.lastName,
          profileImageUrl: response.profileImageUrl,
          id: response.id,
          businessId: currentUser.businessId
        };
        if (isEditUser) {
          this.userTitle = response.firstName + "'s Profile";
        } else {
          this.userTitle = 'My Profile';
          // this.store.dispatch(new SetPublicUserId(currentUser?.id));
        }
        if (response.roles.name == 'G_SUPPORT_USER') {
          this.currentSupportUser = true;
        }
        this.sendMessage(userResp);
        this.userData = response;
        this.username = response.email;
        this.sendMessage(response);
        // this.clinicList = response.clinics;
        // this.servicesList = response.services;
        // this.serviceCategory = response.userServiceCategories;
        if (response.roles.length > 0) {
          this.loggedInUserRoles = response.roles.name;
        }
        this.profileImageUrl =
        response?.profileImageUrl  ? response?.profileImageUrl  + '?t=' + new Date() :
          'https://g99plus.b-cdn.net/AEMR/assets/img/profileDefault.png';

        this.profileImageUrl = response.profileImageUrl;
        this.updateUserForm(response);
      })
      .catch((e) => {
        console.log(e);
        this.toastService.error('Unable to load User !!');
      });
  }

  loadClinics() {
    this.userService.getClinics().then(
      (response: any) => {
        this.clinicList = response;
      },
      () => {
        this.toastService.error('Unable to load clinics.');
      }
    );
  }

  OnClinicSelect(e: any) {
    const clinicIds = e.value;
    this.loadClinicCategoryService(clinicIds);
  }
  loadClinicCategoryService(clinicIds?: any) {
    this.serviceCategory = [];
    this.userService
      .getOptimizedClinicServiceCategories(clinicIds)
      .then((response: any) => {
        this.serviceCategory = response;
        if (clinicIds && this.serviceCategory.length < 1) {
          this.servicesList = [];
          this.serviceCategory = [];
          if (this.userForm && this.userForm.get('serviceCategoryIds')) {
            this.userForm.get('serviceCategoryIds').setValue([]);
          }
          if (this.userForm && this.userForm.get('serviceIds')) {
            this.userForm.get('serviceIds').setValue([]);
          }
          if (this.isProvider) {
            this.userForm.get('serviceIds').setValidators(Validators.required);
            this.userForm
              .get('serviceCategoryIds')
              .setValidators(Validators.required);
          }
        }
        if (clinicIds == null || isEmpty(clinicIds)) {
          if (this.userForm && this.userForm.get('serviceCategoryIds')) {
            this.userForm.get('serviceCategoryIds').setValue([]);
          }
          if (this.userForm && this.userForm.get('serviceIds')) {
            this.userForm.get('serviceIds').setValue([]);
          }
          if (this.isProvider) {
            this.userForm.get('clinicIds').setValidators(Validators.required);
            this.userForm.get('serviceIds').setValidators(Validators.required);
            this.userForm
              .get('serviceCategoryIds')
              .setValidators(Validators.required);
          }
        }
      })
      .catch(() => {
        this.toastService.error(
          'Unable to load service category for selected clinic.'
        );
      });
  }

  OnServiceCategroySelect(e: any) {
    this.loadServiceByCategory(e.value);
  }

  loadServiceByCategory(ids: any) {
    this.servicesList = [];
    this.userService
      .getOptimizedCategoriesServices(ids)
      .then((response: any) => {
        this.servicesList = response;
        // below function is called becuase in case of edit mode there will be some services available to the user
        // But when we remove any category we need to remove all the service related to those service in te service array
        this.filterSelectedService();
        if (isEmpty(ids)) {
          if (this.isProvider) {
            this.userForm
              .get('serviceCategoryIds')
              .setValidators(Validators.required);
            this.userForm.get('serviceIds').setValidators(Validators.required);
            this.userForm.get('serviceCategoryIds').updateValueAndValidity();
            this.userForm.get('serviceIds').updateValueAndValidity();
          }
        }
      })
      .catch(() => {
        this.toastService.error(
          'Unable to load service  for selected clinic and category.'
        );
      });
  }

  filterSelectedService() {
    const selectedService = this.userForm.value.serviceIds;
    if (selectedService) {
      if (selectedService.length > 0) {
        const filteredServices = this.servicesList.filter((el: any) => {
          return selectedService.some((f: any) => {
            return f === el.id;
          });
        });
        console.log(filteredServices);
        const filteredServicesIds =
          filteredServices.length > 0 ? this.getIds(filteredServices) : null;
        this.userForm.patchValue({
          serviceIds: filteredServicesIds
        });
      }
    }
  }

  onServiceSelect(ids: any) {
    if (isEmpty(ids) && this.isProvider) {
      this.userForm.get('serviceIds').setValidators(Validators.required);
      this.userForm.get('serviceIds').updateValueAndValidity();
    }
  }

  getIds(item: any) {
    return item.map((data: any) => data.id);
  }

  toggleProvider(e: any) {
    if (e.checked) {
      this.isProvider = true;
      this.initalizeUserForm();
    } else {
      this.isProvider = false;
      this.initalizeUserForm();
    }
  }

  submitForm() {
    const formData = this.userForm.value;
    formData.roleId = Number(this.userForm.value.roleId);
    if (!this.isProvider) {
      formData.clinicIds = null;
      formData.serviceIds = null;
      formData.serviceCategoryId = 0;
      formData.serviceCategoryIds = null;
    }

    if (this.userId) {
      this.localStorgaeService.removeStorage('newUser');
      this.updateUser(formData);
    } else {
      this.localStorgaeService.removeStorage('newUser');
      this.createUser(formData);
    }
  }

  sendMessage(profile: any) {
    if (this.userId === this.loggedInUserId) {
      this.authService.sendMessage(profile);
      const currentUser = this.localStorgaeService.readStorage('currentUser');
      currentUser['firstName'] = profile?.firstName ?? currentUser['firstName'];
      currentUser['lastName'] = profile?.lastName ?? currentUser['lastName'];
      currentUser['profileImageUrl'] =
        profile?.profileImageUrl ?? currentUser['profileImageUrl'];
      this.localStorgaeService.storeItem('currentUser', currentUser);
    }
  }

  updateUser(formData: any) {
    this.userService.updateUser(this.userId, formData).then(
      (response: any) => {
        var userResp: any = {
          firstName: response.firstName,
          lastName: response.lastName,
          profileImageUrl: response.profileImageUrl,
          id: response.id
        };
        this.sendProviderInfoToQuicLink();
        this.sendMessage(userResp);
        if (this.croppedImage) {
          this.saveImage();
        }
        this.toastService.success('User updated successfully.');
        this.goBack();
      },
      () => {
        this.toastService.error('Unable to save the user.');
      }
    );
  }

  sendProviderInfoToQuicLink() {
    const currentUser = this.localStorgaeService.readStorage('currentUser');
    if (currentUser.id == this.userId) {
      this.store.dispatch(new SetPublicUserId(currentUser?.id));
    }
  }

  createUser(formData: any) {
    //return;
    this.userService.createUser(formData).then(
      (response: any) => {
        this.userId = response.id;
        if (this.croppedImage) {
          const f = new FormData();
          f.append(
            'file',
            this.convertImageService.base64ToFile(this.croppedImage)
          );
          this.saveImage('newUser');
          this.toastService.success('User created successfully');
          this.goBack();
          //this.router.navigate(['/users']);
        } else {
          this.toastService.success('User created successfully');
          this.goBack();
        }
      },
      (err: any) => {
        this.toastService.error(err.error.errorMessage);
      }
    );
  }

  goBack() {
    this.router.navigate(['/users']);
  }

  loadRoles() {
    this.roleService.getOptimizedRoles().then(
      (response: any) => {
        var roles1 = [];
        for (var i = 0; i < response.length; i++) {
          if (response[i].name != 'Patient') {
            roles1.push(response[i]);
          }
        }
        this.roles = roles1;
        // this.roles = response;
      },
      () => {
        this.toastService.error('Unable to load the roles.');
      }
    );
  }

  fileChangeEvent(e: any) {
    this.showModalForImage = true;
    this.imageChangedEvent = e;
  }

  cancelImageUpload() {
    this.showModalForImage = false;
    this.myFileInput.nativeElement.value = '';
  }

  saveImage(newUser?: any) {
    if (this.userId && this.userId !== 0) {
      const formData = new FormData();
      formData.append(
        'file',
        this.convertImageService.base64ToFile(this.croppedImage)
      );
      this.userService
        .uploadImage(this.userId, formData)
        .then((response: any) => {
          this.profileImageUrl = response.profileImageUrl + '?t=' + new Date();
          if (!newUser) {
            var userResp: any = {
              firstName: response.firstName,
              lastName: response.lastName,
              profileImageUrl: this.profileImageUrl,
              id: response.id
            };
            this.sendMessage(userResp);
            this.showModalForImage = false;
          } else {
            this.goBack();
          }
          this.toastService.success('Image updated successfully!!');
        })
        .catch(() => {
          this.toastService.error('Error while uploading image');
        });
    } else {
      this.profileImageUrl = this.croppedImage;
      this.showModalForImage = false;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 768) {
      this.isMobileDevice = true;
    } else {
      this.isMobileDevice = false;
    }
  }
  get f() {
    return this.userForm.controls;
  }

  onCancelSubmit() {
    this.router.navigate(['/users']);
  }

  deleteProfile() {
    this.userService.deleteProfile(this.userId).then(
      () => {
        this.profileImageUrl = null;
        const currentUser = this.localStorgaeService.readStorage('currentUser');
        var userResp: any = {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          profileImageUrl: this.profileImageUrl,
          id: currentUser.id
        };
        this.sendMessage(userResp);
        this.toastService.success('Deleted successfully.');
      },
      () => {
        this.toastService.error('Unable to delete.');
      }
    );
  }

  getLandingPageCount() {
    this.landingPage.getLandingPageCount().then((data: any) => {
      if (data < 1) {
        this.showModalForTemplate = true;
      }
    });
  }

  aiModelClose(event: any) {
    if (event?.replace) {
      this.userForm.patchValue({
        description: event.replaceData
      });
    }
    this.showAiModal = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterImageSelection(event: any) {
    this.showModalForTemplate = false;
  }
}
