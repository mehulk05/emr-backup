import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { currentUserService } from 'src/app/modules/authentication/services/current-user.service';
import { debounce } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  error403Count: number = 0;
  private hostUrl = environment.SERVER_API_URL;
  private importCenterUrl = environment.SERVER_API_URL;
  constructor(
    public http: HttpClient,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    public localStorageService: LocalStorageService,
    private toastrService: ToasTMessageService,
    private currentUserService: currentUserService
  ) {}

  async getHeader(headerOptions: any, doNotSendAuthorizationParam: boolean) {
    const headerParams: any = {};
    const token: any = await this.localStorageService.readStorage('currentUser')
      ?.idToken;
    //const token = 'asdfsqkjdshgakdhdJasjghHSAJDKSDJHKJJ';

    if (doNotSendAuthorizationParam !== true && token) {
      headerParams.Authorization = `Bearer ${token}`;
    }

    if (headerOptions) {
      Object.assign(headerParams, headerOptions);
    }

    const headers = new HttpHeaders(headerParams);

    // if (headerOptions['X-TenantID']) {
    //   headers = headers.append(
    //     'X-TenantID',
    //     headerOptions['X-TenantID'].toString()
    //   );
    // }
    return { headers };
  }

  async getPublicTextHeader(headerOptions: any) {
    const headerParams: any = {};

    if (headerOptions) {
      Object.assign(headerParams, headerOptions);
    }

    const headers = new HttpHeaders(headerParams);

    return Object.create({ headers, responseType: 'text' });
  }

  async getTextHeader(
    headerOptions: any,
    doNotSendAuthorizationParam: boolean
  ) {
    const headerParams: any = {};
    const token: any = await this.localStorageService.readStorage('currentUser')
      ?.idToken;
    //const token = 'asdfsqkjdshgakdhdJasjghHSAJDKSDJHKJJ';

    if (doNotSendAuthorizationParam !== true && token) {
      headerParams.Authorization = `Bearer ${token}`;
    }

    if (headerOptions) {
      Object.assign(headerParams, headerOptions);
    }

    const headers = new HttpHeaders(headerParams);

    // if (headerOptions['X-TenantID']) {
    //   headers = headers.append(
    //     'X-TenantID',
    //     headerOptions['X-TenantID'].toString()
    //   );
    // }
    return Object.create({ headers, responseType: 'text' });
  }

  post(
    url: string,
    body: any,
    errorMsg: any = '',
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {},
    loaderContinue?: any,
    isImportExportCenter: boolean = false
  ) {
    return new Promise(async (resolve, reject) => {
      var baseUrl = this.hostUrl;
      if (isImportExportCenter) {
        baseUrl = this.importCenterUrl;
      }
      const options = await this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      this.http
        .post(`${baseUrl}${url}`, body, options)
        .pipe(
          map((res) => {
            if (!loaderContinue) {
              // this.stopLoader();
            }
            return res;
          })
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            if (errorMsg) {
              this.handleError(errorMsg);
            } else {
              this.handleError(err);
            }

            reject(err);
          }
        );
    });
  }

  get(
    url: string,
    errorMsg: any = '',
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any,
    loaderContinue?: any
  ) {
    return new Promise(async (resolve, reject) => {
      const options = await this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      this.http
        .get(`${this.hostUrl}${url}`, options)
        .pipe(
          map((res) => {
            if (!loaderContinue) {
              // this.stopLoader();
            }
            return res;
          })
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            if (errorMsg) {
              this.handleError(errorMsg);
            } else {
              this.handleError(err);
            }
            reject(err);
          }
        );
    });
  }

  getText(
    url: string,
    errorMsg: any = '',
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any,
    loaderContinue?: any
  ) {
    return new Promise(async (resolve, reject) => {
      console.log('header', headerOptions);
      const options = await this.getTextHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      this.http
        .get(`${this.hostUrl}${url}`, options)
        .pipe(
          map((res) => {
            if (!loaderContinue) {
              // this.stopLoader();
            }
            return res;
          })
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            if (errorMsg) {
              this.handleError(errorMsg);
            } else {
              this.handleError(err);
            }

            reject(err);
          }
        );
    });
  }

  put(
    url: any,
    body: any,
    errorMsg: any = '',
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {},
    loaderContinue?: any
  ) {
    return new Promise(async (resolve, reject) => {
      const options = await this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      this.http
        .put(`${this.hostUrl}${url}`, body, options)
        .pipe(
          map((res) => {
            if (!loaderContinue) {
              // this.stopLoader();
            }
            return res;
          })
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            console.log(err);
            if (errorMsg) {
              this.handleError(errorMsg);
            } else {
              this.handleError(err);
            }

            reject(err);
          }
        );
    });
  }

  patch(
    url: any,
    body: any,
    errorMsg: any = '',
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {},
    loaderContinue?: any
  ) {
    return new Promise(async (resolve, reject) => {
      const options = await this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      this.http
        .patch(`${this.hostUrl}${url}`, body, options)
        .pipe(
          map((res) => {
            if (!loaderContinue) {
              // this.stopLoader();
            }
            return res;
          })
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            if (errorMsg) {
              this.handleError(errorMsg);
            } else {
              this.handleError(err);
            }

            reject(err);
          }
        );
    });
  }

  delete(
    url: any,
    errorMsg: any = '',
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {},
    loaderContinue?: any
  ) {
    return new Promise(async (resolve, reject) => {
      const options = await this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      this.http
        .delete(`${this.hostUrl}${url}`, options)
        .pipe(
          map((res) => {
            if (!loaderContinue) {
              // this.stopLoader();
            }
            return res;
          })
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            if (errorMsg) {
              this.handleError(errorMsg);
            } else {
              this.handleError(err);
            }

            reject(err);
          }
        );
    });
  }

  getCsv(
    url: string,
    body: any,
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {},
    loaderContinue?: any
  ) {
    return new Promise(async (resolve, reject) => {
      const options: any = await this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      options['responseType'] = 'blob' as 'json';
      this.http
        .get(`${this.hostUrl}${url}`, options)
        .toPromise()
        .then((res: any) => {
          if (!loaderContinue) {
            this.stopLoader();
          }
          resolve(res);
          const fileName = `${body.fileName}.csv`;
          const blob = new Blob([res], { type: 'text/plain;charset=utf-8' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${fileName}`);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {
          this.handleError(err);
          reject(err);
        });
    });
  }

  getPdf(
    url: string,
    body: any,
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {},
    loaderContinue?: any
  ) {
    return new Promise(async (resolve, reject) => {
      const options: any = await this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      options['responseType'] = 'blob' as 'json';
      this.http
        .get(`${this.hostUrl}${url}`, options)
        .pipe(
          map((res) => {
            if (!loaderContinue) {
              // this.stopLoader();
            }
            return res;
          })
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  savePdf(
    url: string,
    body: any,
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {},
    loaderContinue?: any
  ) {
    return new Promise(async (resolve, reject) => {
      const options: any = await this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      options['responseType'] = 'blob';
      this.http
        .post(`${this.hostUrl}${url}`, body, options)
        .pipe(
          map((res) => {
            if (!loaderContinue) {
              // this.stopLoader();
            }
            return res;
          })
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  async handleError(err: any) {
    if (typeof err == 'string') {
      this.error(err);
    } else {
      if (err.status === 400) {
        this.error(err?.error?.error?.message);
      } else if (err.status === 403) {
        const supportLoginObj =
          this.localStorageService.readStorage('supportLoginOrg');

        if (supportLoginObj?.loginType === 'support') {
          this.error403Count++;

          if (this.error403Count > 2) {
            this.handleUnauthorizedError();
          }
        } else {
          this.handleUnauthorizedError();
        }
        // const supportLoginObj =
        //   this.localStorageService.readStorage('supportLoginOrg');
        // console.log(
        //   '🚀 ~ file: api.service.ts:447 ~ ApiService ~ handleError ~ supportLoginObj:',
        //   supportLoginObj
        // );

        // if (!(supportLoginObj?.loginType === 'support')) {
        //   console.log('coming to api servce');
        //   this.localStorageService.clearStorage();
        //   this.logout();
        // } else {
        //   this.error403Count++;
        //   if (this.error403Count > 2) {
        //     this.logout();
        //   }
        // }
      } else if (err.status === 404) {
        this.error(err.error.error?.message);
      } else if (err.status === 401) {
        this.logout();
        this.error(err.error.error.message);
      } else if (err.status === 412) {
        this.error(err.error.error.message);
      } else if (err.status === 422) {
        this.error(err.error.error.message);
      } else if (err.status === 500) {
        // this.error(ERROR_HANDLER_MESSAGE.INTERNAL_SERVER_ERROR);
      } else if (err.status === 0) {
        // this.error(ERROR_HANDLER_MESSAGE.SERVER_ERROR_OR_NO_INTERNET);
      }
    }
  }

  private handleUnauthorizedError() {
    // Clear local storage and perform logout
    this.localStorageService.clearStorage();
    debounce(this.logout, 100);
  }

  logout() {
    this.localStorageService.clearStorage();
    this.currentUserService.logout();
    this.localStorageService.storeItemInSession('isUnauthorized', 'yes');
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 100);
  }

  saveExcel(
    url: string,
    doNotSendAuthorizationParam: boolean = false,
    headerOptions: any = {},
    loaderContinue?: any,
    isImportExportCenter: boolean = false
  ) {
    let baseUrl = `${this.hostUrl}${url}`;
    if (isImportExportCenter) {
      baseUrl = `${this.importCenterUrl}${url}`;
    }
    return new Promise(async (resolve, reject) => {
      const options: any = await this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      options['responseType'] = 'blob';
      this.http
        .get(baseUrl, options)
        .pipe(
          map((res) => {
            if (!loaderContinue) {
            }
            return res;
          })
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  saveExcelPost(
    url: string,
    doNotSendAuthorizationParam: boolean = false,
    body: any = {},
    headerOptions: any = {},
    loaderContinue?: any,
    isImportExportCenter: boolean = false
  ) {
    let baseUrl = `${this.hostUrl}${url}`;
    if (isImportExportCenter) {
      baseUrl = `${this.importCenterUrl}${url}`;
    }
    return new Promise(async (resolve, reject) => {
      const options: any = await this.getHeader(
        headerOptions,
        doNotSendAuthorizationParam
      );
      options['responseType'] = 'blob';
      this.http
        .post(baseUrl, body, options)
        .pipe(
          map((res) => {
            if (!loaderContinue) {
            }
            return res;
          })
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  error(message: string) {
    this.stopLoader();
    if (message) {
      this.toastrService.error(message, 'Error');
    }
  }

  startLoader() {
    this.ngxLoader.start();
  }

  stopLoader() {
    this.ngxLoader.stop();
  }

  putEmailUnsubscribe(
    url: any,
    body: any,
    errorMsg: any,
    doNotSendAuthorizationParam?: boolean,
    headerOptions: any = {},
    loaderContinue?: any
  ) {
    return new Promise(async (resolve, reject) => {
      const options = await this.getPublicTextHeader(headerOptions);
      this.http
        .put(`${this.hostUrl}${url}`, body, options)
        .pipe(
          map((res) => {
            if (!loaderContinue) {
              // this.stopLoader();
            }
            return res;
          })
        )
        .subscribe(
          (res) => {
            resolve(res);
          },
          (err) => {
            if (errorMsg) {
              this.handleError(errorMsg);
            } else {
              this.handleError(err);
            }

            reject(err);
          }
        );
    });
  }
}
