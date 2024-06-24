import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { currentUserService } from 'src/app/modules/authentication/services/current-user.service';
import { MustMatch } from 'src/app/modules/authentication/validators/must-match.validator';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  userId: number = 0;
  errorMessage: string;
  constructor(
    private formBuilder: FormBuilder,
    private currentUserService: currentUserService,
    private userProfileService: UserProfileService,
    private toastMessageService: ToasTMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(RegexEnum.passwordValidation)
          ]
        ],
        confirmPassword: ['', [Validators.required]],
        userName: ['']
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword')
      }
    );

    this.currentUserService.currentUserSubject.subscribe((data) => {
      this.userId = data.id;
      this.getUserDetailsById();
    });
  }

  getUserDetailsById() {
    this.userProfileService.getUserById(this.userId).then((data: any) => {
      this.changePasswordForm.patchValue({
        userName: data?.email
      });
    });
  }
  submitForm() {
    this.userProfileService.changePassword(this.changePasswordForm.value).then(
      () => {
        this.toastMessageService.success('Password  Changed Successfully');
        //this.router.navigate(['']);
        this.goBack();
      },
      () => {
        this.errorMessage =
          'There was an error while updating the password. Please refresh or try again later';
      }
    );
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  goBack() {
    console.log('balc');
    this.router.navigate(['users/profile']);
  }
}
