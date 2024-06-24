import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from '../../services/auth.service';
import { MustMatch } from '../../validators/must-match.validator';

@Component({
  selector: 'app-account-register',
  templateUrl: './account-register.component.html',
  styleUrls: ['./account-register.component.css']
})
export class AccountRegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;
  errMsg: any;

  addressOptionCountry: any = {
    ComponentRestrictions: {
      country: ['US']
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern(RegexEnum.email)]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(RegexEnum.passwordValidation)
          ]
        ],
        confirmPassword: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(RegexEnum.phone)]],
        businessName: ['', [Validators.required]],
        agreeTerms: [true, []],
        address: ['', Validators.required]
      },
      {
        validator: MustMatch('password', 'confirmPassword')
      }
    );
  }
  get f() {
    return this.registrationForm.controls;
  }

  submitForm() {
    this.submitted = true;
    if (this.registrationForm.invalid) {
      return;
    }
    this.authService
      .registerAccount(this.registrationForm.value)
      .then(() => {
        this.router.navigate([''], {
          state: {
            acaccountMsg:
              'Your account has been created. We have sent you an email for verification. Please check your email to verify'
          }
        });
      })
      .catch((e) => {
        this.apiService.error(
          e.error.errorMessage ?? 'There is some error creating account'
        );
        this.errMsg =
          e.error.errorMessage ?? 'There is some error creating account';
      });
  }

  public handleAddressChange(address: any) {
    this.registrationForm.patchValue({ address: address.formatted_address });
  }
}
