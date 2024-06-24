import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AuthService } from '../../services/auth.service';
import { MustMatch } from '../../validators/must-match.validator';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  loginForm!: FormGroup;
  changePasswordForm: FormGroup;
  businessId: any;
  isShowPassword: any;
  errMsg = '';
  accountCreationMessage: any;
  isChangePassword = false;

  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToasTMessageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(RegexEnum.email)]]
    });

    this.changePasswordForm = this.formBuilder.group(
      {
        email: ['', []],
        username: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!])[a-zA-Z0-9@$!]{8,}$'
            )
          ]
        ],
        confirmationCode: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );

    this.activatedRoute.params.subscribe((data: any) => {
      if (data && Object.keys(data).length > 0) {
        this.isChangePassword = true;

        this.changePasswordForm.patchValue({
          username: data.email,
          email: data.email
        });

        this.changePasswordForm.controls['email'].disable();

        this.authService.forgotPassword(data.email).then(() => {
          // this.alertService.success("Send successfully");
        });
      }
    });
  }

  async submitForm() {
    const formData = this.loginForm.value;
    const user = await this.authService.getUserByEmail(formData.email);
    console.log(user);
    if (user) {
      this.errMsg = null;
      this.authService.forgotPassword(formData.email).then((res: any) => {
        console.log(res);
        this.isChangePassword = true;
        this.changePasswordForm.patchValue({
          username: formData.email,
          email: formData.email
        });
        this.changePasswordForm.controls['email'].disable();
      });
    } else {
      this.errMsg = "The user with given email address doesn't exist!";
      this.toastService.error(
        "The user with given email address doesn't exist!"
      );
    }
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  submitChangePassword() {
    const formData: any = this.changePasswordForm.value;
    this.authService.confirmForgotPassword(formData).then(
      () => {
        this.toastService.success('Password changed successfully.');
        this.router.navigate(['/']);
      },
      () => {
        this.toastService.error(
          'Unable to change the password. Please try again.'
        );
        this.errMsg =
          'There was an error while updating the password. Please refresh or try again later';
      }
    );
  }
}
