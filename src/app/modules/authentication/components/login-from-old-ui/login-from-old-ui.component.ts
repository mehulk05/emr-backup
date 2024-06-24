import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-from-old-ui',
  templateUrl: './login-from-old-ui.component.html',
  styleUrls: ['./login-from-old-ui.component.css']
})
export class LoginFromOldUIComponent implements OnInit {
  currentUser: any = {};
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    localStorage.clear();
    this.activatedRoute.queryParams.subscribe((data) => {
      const currentUser: any = {};

      currentUser.idToken = data.token;
      currentUser.id = data?.userId;
      currentUser.roles = data?.roles;
      currentUser.businessId = data?.bid;
      currentUser.supportUser = data?.supportUser;
      const supportUser = currentUser.supportUser;
      if (supportUser && supportUser != 'false') {
        currentUser.supportUser = true;
      } else {
        currentUser.supportUser = false;
      }
      this.currentUser = currentUser;
      this.loadBuisnessInfo(data?.bid);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      this.authService.updateLoggedInUser(currentUser);

      // console.log(url)
      // window.open(url)
    });
  }

  switchUrl(url: any) {
    window.location.replace(url);
  }

  loadBuisnessInfo(bid: any) {
    // let url =
    //   location.protocol +
    //   '//' +
    //   location.hostname +
    //   (location.port ? ':' + location.port : '');
    // url = url + '/users/profile';
    const url = environment.NEW_UI_DOMAIN;
    console.log('here', bid);
    if (bid) {
      this.authService.getBusinessData(bid).then((data: any) => {
        if (!data.deleted) {
          this.authService.emitBuisnessInfoChange(data);
          this.localStorageService.storeItem('businessInfo', data);
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          this.authService.updateLoggedInUser(this.currentUser);
        }
        this.switchUrl(url);
      });
    } else {
      this.switchUrl(url);
    }
  }
}
