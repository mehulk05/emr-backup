import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { AccountRegisterComponent } from './components/account-register/account-register.component';
import { SupportLoginComponent } from './components/support-login/support-login.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { LoginFromOldUIComponent } from './components/login-from-old-ui/login-from-old-ui.component';
import { SelectBusinessComponent } from './components/select-business/select-business.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { SharedModule } from '../../shared/shared.module';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  declarations: [
    UserLoginComponent,
    ForgetPasswordComponent,
    AccountRegisterComponent,
    SupportLoginComponent,
    EmailVerificationComponent,
    LoginFromOldUIComponent,
    SelectBusinessComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    // GooglePlaceModule,
    SharedModule,
    NgPrimeModule
  ]
})
export class AuthenticationModule {}
