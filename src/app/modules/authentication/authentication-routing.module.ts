import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { LoginFromOldUIComponent } from './components/login-from-old-ui/login-from-old-ui.component';
import { SupportLoginComponent } from './components/support-login/support-login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginFromOldUIComponent,
    data: {
      hideSideBar: true,
      hideHeader: true
    }
  },
  {
    path: 'support/:token',
    component: SupportLoginComponent
  },
  {
    path: 'email-verification/:token',
    component: EmailVerificationComponent
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent
  },
  {
    path: 'email/:email',
    component: ForgetPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
