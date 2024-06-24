// loader-interceptor.service.ts
import { Injectable } from '@angular/core';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  skipUrl = [
    'api/description/*',
    '/api/title/*',
    '/api/notifications/sms-audit-logs/source/*',
    '/api/notifications/sms-audit-logs/read-unread-count',
    '/api/public/clinics/default*',
    '/api/v1/business/email-sms/quota*',
    '/api/public/chatbottemplates/default*',
    '/api/public/business/*',
    '/api/v1/audit/email-sms/*',
    '/api/v1/user/*/*',
    '/api/platform-configurations/agency*',
    '/api/leads/.*/details/merged-data',
    '/api/emailSmsTemplates/Lead/*',
    '/api/notifications/default-number*',
    '/api/v1/patientsByTenantId'
  ];
  constructor(private ngxLoader: NgxUiLoaderService) {}

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    if (this.requests.length > 0) {
      this.ngxLoader.start();
    } else {
      this.ngxLoader.stop();
    }
    // this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isMatch = this.skipUrl.some((rx: any) =>
      new RegExp(rx).test(req.url)
    );

    if (!isMatch) {
      this.requests.push(req);
      this.ngxLoader.start();
    }
    // this.requests.push(req);

    return Observable.create((observer: any) => {
      const subscription = next.handle(req).subscribe(
        (event) => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req);
            observer.next(event);
          }
        },
        (err) => {
          this.removeRequest(req);
          observer.error(err);
        },
        () => {
          this.removeRequest(req);
          observer.complete();
        }
      );
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
