import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { currentUserService } from '../../services/current-user.service';
import { Store } from '@ngxs/store';
import { SetBusinessData } from 'src/app/shared/store-management/store/general-states/general-state.action';

@Component({
  selector: 'app-support-login',
  templateUrl: './support-login.component.html',
  styleUrls: ['./support-login.component.css']
})
export class SupportLoginComponent implements OnInit {
  private token: any = null;

  constructor(
    private router: Router,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private authenticationService: AuthService,
    private currentUserService: currentUserService
  ) {
    localStorage.clear();
  }

  ngOnInit(): void {
    this.clearSubjects();
    this.localStorageService.storeItem('supportLoginOrg', {
      loginType: 'support'
    });
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.token = params.get('token');
      console.log(this.token);
      this.login();
    });
  }

  login() {
    this.authenticationService
      .supportLogin(this.token)
      .then((response: any) => {
        // this.router.navigate(['/users/profile']);
        this.authenticationService
          .getBusinessData(response.businessId)
          .then((businessData: any) => {
            console.log(businessData);
            this.store.dispatch(new SetBusinessData(businessData));

            this.localStorageService.storeItem('businessData', businessData);
            this.localStorageService.storeItem('businessInfo', businessData);
            this.authenticationService.updateLoggedInUser(response);
            this.localStorageService.storeItem('currentUser', response);
            this.currentUserService.currentUserSubject.next(response);
            this.authenticationService.currentBusinessSubject.next(
              businessData
            );
            this.localStorageService.storeItem('loginType', {
              loginType: 'support'
            });
            setTimeout(() => {
              this.router.navigate(['/business']);
            }, 1000);
          })
          .catch((e: any) => {
            console.log(e);
          });
        console.log('support login response:-', response);
      });
  }

  clearSubjects() {
    this.localStorageService.clearStorage();
    this.currentUserService.currentUserSubject.next(null);
    this.currentUserService.businessInfo.next(null);
    this.authenticationService.currentBusinessSubject.next(null);
    this.localStorageService.removeStorage('sidebarData');
  }
}
