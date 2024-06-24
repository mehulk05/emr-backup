import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { MustMatch } from 'src/app/modules/authentication/validators/must-match.validator';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientProfileService } from '../../service/patient-profile.service';

@Component({
  selector: 'app-patient-change-password',
  templateUrl: './patient-change-password.component.html',
  styleUrls: ['./patient-change-password.component.css']
})
export class PatientChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  @Input() patientId: any;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userProfileService: PatientProfileService,
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

    this.authService.currentUserSubject.subscribe((data) => {
      this.patientId = data.id;
      this.getUserDetailsById();
    });
  }

  getUserDetailsById() {
    this.userProfileService.getUserById(this.patientId).then((data: any) => {
      console.log('prle', data);
      this.changePasswordForm.patchValue({
        userName: data?.email
      });
    });
  }
  submitForm() {
    this.userProfileService
      .changePassword(this.changePasswordForm.value)
      .then(() => {
        this.toastMessageService.success('Password  Changed Successfully');
        this.router.navigate(['/patient-portal/patient/profile']);
      });
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  goBack() {
    //this.router.navigate(['users/profile']);
    this.router.navigate(['/patient-portal/patient/profile']);
  }
}
