import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { LoaderInterceptor } from './shared/services/Interceptors/loader.interceptor';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { NgxsModule, NgxsModuleOptions } from '@ngxs/store';
import { GeneralAppInfoState } from './shared/store-management/store/general-states/general.state';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

export const APP_NGXS_CONFIG: NgxsModuleOptions = {
  developmentMode: !environment.production,
  selectorOptions: {
    suppressErrors: false,
    injectContainerState: false
  },
  compatibility: {
    strictContentSecurityPolicy: true
  }
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AuthenticationModule,
    SharedModule,
    RecaptchaV3Module,
    ToastrModule.forRoot(),
    NgxsModule.forRoot([GeneralAppInfoState], APP_NGXS_CONFIG),
    // DataTablesModule.forRoot()
    NgChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.siteKey
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
