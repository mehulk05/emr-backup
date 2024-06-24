import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { currentUserService } from 'src/app/modules/authentication/services/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class ToasTMessageService {
  isUnauthorized: string = sessionStorage.getItem('isUnauthorized') || '';

  currentUserData: any = null;
  constructor(
    private toastrService: ToastrService,
    private authService: currentUserService
  ) {
    // console.log('hi');
    // this.authService.currentUserSubject.subscribe((data) => {
    //
    // });
    this.currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  success(message: string, title?: string) {
    this.toastrService.success(message, title ?? 'Success', {
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      timeOut: 3000
    });
  }

  error(message: string, title?: string) {
    this.authService.currentUserSubject.subscribe((data) => {
      this.currentUserData = data;
    });
    console.log('isUNauthorized', this.isUnauthorized);
    if (
      this.currentUserData &&
      this.currentUserData?.id &&
      !this.isUnauthorized
    ) {
      this.errorToast(message, title);
    }
  }

  errorToast(message: string, title?: string) {
    this.toastrService.error(message, title ?? 'Error', {
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      timeOut: 3000
    });
  }

  info(message: string, title?: string) {
    this.toastrService.info(message, title ?? 'Information', {
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      timeOut: 3000
    });
  }

  warn(message: string, title?: string) {
    this.toastrService.warning(message, title ?? 'Warning', {
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      timeOut: 3000
    });
  }
}
