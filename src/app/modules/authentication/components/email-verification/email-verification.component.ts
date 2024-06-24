import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AuthHelperService } from '../../services/auth-helper.service';
import { AuthService } from '../../services/auth.service';
import { currentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  token: any = null;
  emailVerified = false;
  emailInvalid = false;
  isLoggedIn = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authHelperService: AuthHelperService,
    private alertService: ToasTMessageService,
    private authService: AuthService,
    private currentUserService: currentUserService
  ) {}

  ngOnInit(): void {
    this.authService.currentUserSubject.next(null);
    this.currentUserService.currentUserSubject.next(null);
    localStorage.clear();
    this.token = this.activatedRoute.snapshot.params.token;
    console.log(this.token);
    const currentUser = this.currentUserService.currentUserValue;
    /* If another user is logged in do not verify email */
    if (currentUser && Object.keys(currentUser).length > 0) {
      this.isLoggedIn = true;
    }
    this.authService.currentUserSubject.next(null);
    localStorage.clear();
    // if (this.token != null && this.isLoggedIn == false) {
    //   this.verifyEmail();
    // }
    this.verifyEmail();
  }

  verifyEmail() {
    this.authHelperService
      .verifyEmail(this.token)
      .then(() => {
        this.emailVerified = true;
        this.alertService.success('Email has been verified successfully!');
      })
      .catch(() => {
        this.emailInvalid = true;
      });
  }
}
