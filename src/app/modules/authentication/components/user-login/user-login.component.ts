/* eslint-disable prettier/prettier */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subscription, from, isObservable } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ApiService } from 'src/app/shared/services/api.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import {
  GetBusinessInfo,
  SetBusinessData
} from 'src/app/shared/store-management/store/general-states/general-state.action';
import { getBusinessData } from 'src/app/shared/store-management/store/general-states/general-state.selector';
import { AuthService } from '../../services/auth.service';
import { currentUserService } from '../../services/current-user.service';
import { isEqual } from 'lodash';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  businessId: any;
  isShowPassword: any;
  errMsg = '';
  accountCreationMessage: any;
  showBusinessSelectionModal: boolean;
  userDatabyEmailAPI: any;
  subcscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private currentUserService: currentUserService,
    private store: Store
  ) {}
  ngOnDestroy(): void {
    this.subcscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(RegexEnum.email)]],
      password: ['', [Validators.required]]
    });

    this.accountCreationMessage = history.state.isDataModified ?? null;
    this.currentUserService.currentUserSubject.subscribe((data) => {
      console.log(data);
      if (data) {
        this.localStorageService.storeItem('currentUser', data);
      }
      if (data && data?.businessId) {
        this.redirect(data.roles);
        // this.router.navigate(['/users/profile']);
      }
      // else {
      //   this.currentUserService.currentUserSubject.next(null);
      // }
    });
  }

  async submitForm() {
    sessionStorage.clear();
    this.accountCreationMessage = '';
    if (this.loginForm.invalid) {
      return;
    }

    this.subcscription.add(
      from(this.authService.getUsersByEmail(this.loginForm.value.email))
        .pipe(
          switchMap(async (userData: any): Promise<any> => {
            this.userDatabyEmailAPI = userData;
            this.errMsg = '';
            if (userData.length > 1) {
              // If multiple users
              const loginResult = await this.authService
                .loginByEmailAndPass(this.loginForm.value)
                .catch((error: any) => {
                  // Display generic error message for incorrect email or password
                  this.apiService.error(
                    'The email or password is incorrect. Please check and try again.'
                  );
                  this.errMsg =
                    'The email or password is incorrect. Please check and try again.';
                  this.showBusinessSelectionModal = false; // Set to false to prevent opening the modal
                  throw error; // Re-throw the error for further handling if necessary
                });
              if (!loginResult) return []; // Return empty array if login failed
              else {
                // If login is successful, show the business selection modal
                this.showBusinessSelectionModal = true;
                return [];
              }
            } else if (userData.length === 1) {
              this.businessId = userData[0].tenantId;
              this.localStorageService.storeItem('tenantId', this.businessId);
            } else {
              this.errMsg = 'Record for given Email adress is not found';
              return this.apiService.error(
                'Record for given Email address is not found. Please contact our support team for further assistance.'
              );
            }

            if (this.businessId) {
              this.store.dispatch(new GetBusinessInfo(this.businessId));
              return this.store.select(getBusinessData);
            }
            this.errMsg =
              'There is no business record found for ' +
              this.loginForm.value.email;
            return this.apiService.error(
              'There is no business record found for ' +
                this.loginForm.value.email +
                ' Please contact our support team for further assistance.'
            );
          }),
          distinctUntilChanged(isEqual) // Add this operator to filter out consecutive identical emissions

          // catch(err => of([]));
        )
        .subscribe(
          (businessData: any) => {
            // Check if businessData is an observable
            if (isObservable(businessData)) {
              businessData
                .pipe(distinctUntilChanged(isEqual))
                .subscribe((data: any) => {
                  console.log(data);
                  this.handleBusinessData(data);
                });
            } else {
              // If businessData is not an observable, directly handle the data
              this.handleBusinessData(businessData);
            }
          },
          (e: any) => {
            console.log(e);
          }
        )
    );
  }

  handleBusinessData(data: any) {
    if (data && Object.keys(data).length > 0 && !data.deleted) {
      console.log('here', data, typeof data);
      this.authService.currentBusinessSubject.next(data);
      this.authService.emitBuisnessInfoChange(data);
      this.localStorageService.storeItem('businessInfo', data);
      this.localStorageService.storeItem('businessData', data);

      this.userLoginAfterBusinessVerification(this.loginForm.value);
    }
  }

  userLoginAfterBusinessVerification(loginCredentials: any) {
    loginCredentials.businessId = this.businessId;
    this.authService
      .loginWithCredsAndBid(loginCredentials)
      .then((data: any) => {
        this.localStorageService.storeItem('currentUser', data);
        this.currentUserService.currentUserSubject.next(data);
        this.authService.currentUserSubject.next(data);
        this.redirect(data.roles);
        this.errMsg = '';
      })
      .catch((e) => {
        if (e.error.message.trim() == 'Email address is not verified.'.trim()) {
          this.apiService.error(
            'Verification pending - Please verify your email address'
          );
          this.errMsg =
            'Verification pending - Look for the verification email in your inbox and click the link in that email. A confirmation message will appear in your web browser';
        } else {
          this.apiService.error(
            'The email address or password is incorrect. Please check and try again.'
          );
          this.errMsg =
            'The email address or password is incorrect. Please check and try again.';
        }
      });
  }

  onBusinessSelect(e: any) {
    const data = this.loginForm.value;
    data.businessId = e.bid;
    const businessData = e.businessData;

    // Set business data in local storage
    this.store.dispatch(new SetBusinessData(businessData));
    this.localStorageService.storeItem('businessData', businessData);
    this.localStorageService.storeItem('businessInfo', businessData);
    this.authService.currentBusinessSubject.next(businessData);
    this.authService.emitBuisnessInfoChange(businessData);

    // Attempt login with selected business
    this.authService
      .loginWithCredsAndBid(data)
      .then((data: any) => {
        // Handle successful login
        this.localStorageService.storeItem('currentUser', data);
        this.currentUserService.currentUserSubject.next(data);
        this.authService.currentUserSubject.next(data);
        this.redirect(data.roles);
        this.errMsg = '';
      })
      .catch((e) => {
        // Handle login error, if necessary
        // console.log('Login error:', e);
        console.log('Login error:', e);
        if (e.error.message.trim() == 'Email is not verified.'.trim()) {
          this.apiService.error(
            'Verification pending - Please verify your email'
          );
          this.errMsg =
            'Verification pending - Look for the verification email in your inbox and click the link in that email. A confirmation message will appear in your web browser';
        }
      })
      .finally(() => {
        // Close business selection modal
        this.showBusinessSelectionModal = false;
      });
  }

  redirect(roles: any) {
    if (roles.indexOf('Patient') > -1) {
      this.router.navigate(['/patient-portal/patient/dashboard']);
    } else {
      //  this.router.navigate(['/appointment/calendar']);
      this.router.navigate(['/users/profile']);
    }
  }

  toggleShowPasswordField() {
    this.isShowPassword = !this.isShowPassword;
  }
}
