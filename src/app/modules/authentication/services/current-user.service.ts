import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/shared/models/user/user';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class currentUserService {
  currentUserSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  businessInfo: BehaviorSubject<any> = new BehaviorSubject(null);

  headerSidebarExtraInfo: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    const routePath = window.location.pathname?.split('/');
    if (
      routePath &&
      routePath.length > 0 &&
      !routePath.includes('registration')
    ) {
      console.log('inside current service', routePath);
      this.currentUserSubject.next(
        this.localStorageService.readStorage('currentUser')
      );
    } else {
      this.businessInfo.next(null);
    }

    // this.currentUserSubject.next(
    //   this.localStorageService.readStorage('businessData')
    // );
  }
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  logout() {
    this.localStorageService.clearStorage();
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/');
  }
}
