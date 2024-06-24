import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/modules/authentication/validators/must-match.validator';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { UserService } from '../../../services/user.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';

@Component({
  selector: 'app-support-user-reset-password',
  templateUrl: './support-user-reset-password.component.html',
  styleUrls: ['./support-user-reset-password.component.css']
})
export class SupportUserResetPasswordComponent implements OnInit {
  @Input() userEmail: string;
  isPasswordResetting: boolean = false;
  showModal: boolean = false;

  resetNewPasswordForm: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.resetNewPasswordForm = this.formBuilder.group(
      {
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
  }

  get f() {
    return this.resetNewPasswordForm.controls;
  }

  sendPasswordLink() {
    this.userService.resetPassword(this.userEmail).then(
      () => {
        this.alertService.success(
          'We have sent the link to change the password if given Email is already registered.'
        );
      },
      () => {
        this.alertService.error('Unable to send the Email link');
      }
    );
  }

  showPasswordModal() {
    this.showModal = true;
  }

  cancel() {
    this.showModal = false;
    this.resetNewPasswordForm.reset();
  }

  savePassword() {
    this.resetNewPasswordForm.patchValue({
      userName: this.userEmail
    });
    const formData = this.resetNewPasswordForm.value;
    formData['password'] = formData['newPassword'];
    formData['username'] = this.userEmail;

    this.userService.resetPasswordNow(formData).then(
      () => {
        this.alertService.success('Password has been reset successfuly.');
        this.cancel();
      },
      () => {
        this.alertService.error('Unable to reset the password.');
      }
    );
  }
}
