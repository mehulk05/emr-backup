import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { JsonFormControls, JsonFormData } from './json-form.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-api-integration',
  templateUrl: './api-integration.component.html',
  styleUrls: ['./api-integration.component.css']
})
export class ApiIntegrationComponent {
  public formData: JsonFormData;
  source: any = 'aesthetic';
  integrationRecords: any = {};
  integrationHistories: any = [];
  activatedIntegration: any = {};
  integrationConfig: any = {
    itemsPerPage: 10,
    currentPage: 0,
    id: 8,
    totalItems: 0
  };
  code: string = '';

  showModal = false;
  detailsMessage = '';
  headerName = '';
  title = ' API Details';
  apiName = '';
  helpCenterUlr = '';
  apiIntegration: FormGroup = this.fb.group({});
  isRecordSaved = false;
  constructor(
    private http: HttpClient,
    private router: ActivatedRoute,
    private routerRoute: Router,
    private businessService: BusinessService,
    private toastService: ToastrService,
    private fb: FormBuilder,
    private formatTimeService: FormatTimeService,
    private localStorageService: LocalStorageService
  ) {
    this.router.queryParams.subscribe((paramMap: any) => {
      const code = paramMap['code'];
      console.log(code);
      this.source = paramMap.source;
      if (code) {
        this.source = paramMap.state;
      }
      console.log(this.source);
      this.http
        .get('/assets/api-integration.json')
        .subscribe((formDataRq: any) => {
          this.formData = formDataRq.filter(
            (t: any) => t.type === this.source
          )[0];
          this.apiName = this.formData.name;
          this.title = this.apiName + this.title;
          this.helpCenterUlr = this.formData?.helpCenterUlr;
          this.createForm(this.formData.controls);
        });
      this.getApiIntegrationRecordsCount();
      this.getApiIntegrationRecords();
      this.getApiIntegrationRecordsHistories(this.integrationConfig);

      if (code) {
        if (this.localStorageService.readStorage('podium') != null) {
          const formValue: any = this.localStorageService.readStorage('podium');
          console.log(formValue);
          formValue['code'] = code;
          formValue.type = this.source;
          this.apiIntegration.patchValue(formValue);
          this.formDataSubmitRedirect(formValue);
        }
      }
    });
  }

  createForm(controls: JsonFormControls[]) {
    for (const control of controls) {
      const validatorsToAdd = [];
      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'requiredTrue':
            if (value) {
              validatorsToAdd.push(Validators.requiredTrue);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'minLength':
            validatorsToAdd.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          case 'pattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          case 'redOnly':
            break;
          default:
            break;
        }
      }

      this.apiIntegration.addControl(
        control.name,
        this.fb.control(control.value, validatorsToAdd)
      );
    }
  }

  formControlSetReadOnly(formControl: AbstractControl, isReadonly: boolean) {
    (<any>formControl).nativeElement.readOnly = isReadonly;
  }

  getApiIntegrationRecords() {
    this.businessService
      .getApiIntegrationRecords(this.source)
      .then((data: any) => {
        this.integrationRecords = data;
        if (this.integrationRecords?.id) {
          this.isRecordSaved = true;
          this.apiIntegration.patchValue(this.integrationRecords);
        }
      })
      .catch(() => {
        this.toastService.error('Unable to get API details');
      });
  }

  getApiIntegrationRecordsCount() {
    this.businessService
      .getApiIntegrationHistoryCountRecords(this.source)
      .then((data: any) => {
        this.integrationConfig.totalItems = data;
      })
      .catch(() => {
        this.toastService.error('Unable to get API details');
      });
  }

  getApiIntegrationRecordsHistories(config: any) {
    this.businessService
      .getApiIntegrationHistoryRecords(
        this.source,
        config.currentPage,
        config.itemsPerPage
      )
      .then((data: any) => {
        this.integrationHistories = data;
        this.formatTimeInData();
      })
      .catch(() => {
        this.toastService.error('Unable to get API details');
      });
  }

  formatTimeInData() {
    this.integrationHistories.map((data: any, i: any) => {
      this.integrationHistories[i].createdAt =
        this.formatTimeService.formatTime(data.createdAt);
      this.integrationHistories[i].updatedAt =
        this.formatTimeService.formatTime(data.updatedAt);
    });
  }

  submitForm() {
    if (this.source === 'PODIUM') {
      const data: any = this.apiIntegration.value;
      if (this.integrationRecords?.id) {
        data['id'] = this.integrationRecords?.id;
      }
      this.localStorageService.storeItem('podium', data);
      const redirectUrl =
        data['reDirectAuthUrl'] +
        '?client_id=' +
        data['clientId'] +
        '&redirect_uri=' +
        environment.NEW_UI_DOMAIN +
        data['reDirectUrl'] +
        '&scope=' +
        data['resource'].replaceAll(',', '%20') +
        '&state=PODIUM';
      window.open(redirectUrl, '_blank');
    } else {
      const form: any = this.apiIntegration.value;
      form.type = this.source;
      if (this.integrationRecords?.id) {
        form['id'] = this.integrationRecords?.id;
      }
      this.formDataSubmit(form);
    }
  }

  formDataSubmitRedirect(value: any) {
    this.businessService
      .saveApiIntegrationRecords(value)
      .then(() => {
        this.toastService.success(this.apiName + ' integrated successfully');
        this.routerRoute.navigate(['business/api-integration/api/details'], {
          queryParams: {
            source: this.source
          }
        });
      })
      .catch(() => {
        this.toastService.error('Unable to save API details');
      });
  }

  formDataSubmit(value: any) {
    this.businessService
      .saveApiIntegrationRecords(value)
      .then(() => {
        this.toastService.success(this.apiName + ' integrated successfully');
        this.getApiIntegrationRecords();
      })
      .catch(() => {
        this.toastService.error('Unable to save API details');
      });
  }

  pageChangedForAppointment(event: any) {
    this.integrationConfig.currentPage = event;
    const pageConfig: any = { ...this.integrationConfig };
    pageConfig.currentPage = event - 1;
    if (pageConfig.currentPage < 0) {
      pageConfig.currentPage = 0;
    }
    console.log(pageConfig, this.integrationConfig);
    this.getApiIntegrationRecordsHistories(pageConfig);
  }

  getStatus(status: number) {
    if (status == 0) {
      return 'Completed';
    } else if (status == 1) {
      return 'FAILED';
    }
    return 'Completed';
  }

  getintegrationDetails(request: any, id: any) {
    this.businessService
      .callAestheticRecords(this.source, [JSON.parse(request)], id)
      .then(() => {
        this.getApiIntegrationRecordsHistories(this.integrationConfig);
      })
      .catch(() => {
        this.toastService.error(
          'Unable to save ' + this.apiName + ' API details'
        );
      });
  }

  cancelDetailPopUp() {
    this.showModal = false;
  }

  showMoreIntegrationDetails(message: string, headerName: string) {
    this.detailsMessage = message;
    this.headerName = headerName;
    this.showModal = true;
  }
}
