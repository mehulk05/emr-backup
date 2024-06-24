import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../../../shared/models/user/user';
import { ApiService } from '../../../shared/services/api.service';
import { HttpHelperService } from '../../../shared/services/HttpHelperService';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  profileSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  currentBusinessSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  emailSmsAudit = new BehaviorSubject({});

  isSidebarChanged = new Subject();
  businessInofChange: EventEmitter<any> = new EventEmitter();

  sendMessage(message: string) {
    this.profileSubject.next({ message });
  }

  getBusinessFromCache() {
    return this.localStorageService.readStorage('businessData');
  }
  emitBuisnessInfoChange(info: any): void {
    console.log('from 19');
    this.businessInofChange.emit(info);
  }

  getMessage(): Observable<any> {
    return this.profileSubject.asObservable();
  }

  public currentUser!: Observable<User>;
  constructor(
    private apiService: ApiService,
    private httpHelperService: HttpHelperService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    const routePath = window.location.pathname?.split('/');

    if (
      routePath &&
      routePath.length > 0 &&
      !routePath.includes('registration')
    ) {
      console.log('inside auth service');
      this.currentUserSubject.next(
        this.localStorageService.readStorage('currentUser')
      );
      this.currentBusinessSubject.next(
        this.localStorageService.readStorage('businessData')
      );
      this.currentUser = this.currentUserSubject.asObservable();
    } else {
      this.currentBusinessSubject.next(null);
    }
  }

  public updateLoggedInUser(user: any) {
    console.log('ccoming hhereeeee =-----------------------------');
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  supportLogin(token: any) {
    const apiUrl = '/api/auth/support?t=' + token;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(),
      true
    );
  }

  getUserByEmail(email: string) {
    const apiUrl =
      '/api/public/users/byemail?email=' + encodeURIComponent(email);
    return this.apiService.get(apiUrl, '', false, {}, true);
  }

  unsubscribeEmail(email: string) {
    const apiUrl =
      '/api/public/v1/optout-email?email=' + encodeURIComponent(email);
    return this.apiService.put(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions
    );
  }

  getBusinessData(bid: string) {
    const apiUrl = '/api/public/v1/businesses/' + bid;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions,
      true
    );
  }

  loginByEmailAndPass(loginFormData: any) {
    const url = '/api/auth';
    return this.apiService.post(url, loginFormData);
  }

  /* -------------------------- Registeration method -------------------------- */
  registerAccount(registrationForm: any) {
    {
      const url = '/api/account/register';
      return this.apiService.post(url, registrationForm);
    }
  }

  logout() {
    this.localStorageService.clearStorage();
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/');
  }

  forgotPassword(email: string) {
    const apiUrl =
      '/api/public/users/forgot-password?username=' + encodeURIComponent(email);
    return this.apiService.get(apiUrl, '', false, {}, true);
  }

  confirmForgotPassword(formData: any) {
    const apiUrl = '/api/public/users/forgot-password';
    return this.apiService.put(apiUrl, formData, '', false, {}, true);
  }

  getUsersByEmail(email: any) {
    const apiUrl =
      '/api/public/v1/users/byemail?email=' + encodeURIComponent(email);
    return this.apiService.get(apiUrl, '', false, {}, true);
  }

  loginWithCredsAndBid(formData: any) {
    const url = '/api/user/auth';
    return this.apiService.post(url, formData);
  }
}
