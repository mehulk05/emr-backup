import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/modules/account-and-settings/business/services/business.service';
import { QuestionarieService } from 'src/app/modules/pateint/services/questionarie.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-business-form-integration',
  templateUrl: './business-form-integration.component.html',
  styleUrls: ['./business-form-integration.component.css']
})
export class BusinessFormIntegrationComponent implements OnInit {
  businessForm: FormGroup;
  businessSelected: any;
  businessFormList: any = [];

  showModal = false;
  detailsMessage = '';
  headerName = '';
  businessRecords: any = {};
  businessHistories: any = [];
  totalItems = 0;
  isRecordSaved = false;

  businessConfig: any = {
    itemsPerPage: 10,
    currentPage: 0,
    id: 8,
    totalItems: 0
  };

  constructor(
    public formBuilder: FormBuilder,
    private businessService: BusinessService,
    private toastService: ToasTMessageService,
    private questionarieService: QuestionarieService
  ) {}

  ngOnInit(): void {
    this.businessForm = this.formBuilder.group({
      url: [''],
      businessFormType: ['EMAIL', [Validators.required]]
    });

    this.getApiIntegrationRecordsCount();
    this.getApiIntegrationRecords();
    this.getApiIntegrationRecordsHistories(this.businessConfig);
    this.loadQuestionarie();
  }

  loadQuestionarie() {
    this.questionarieService.getAllQuestionnaireListOptimized().then(
      (data: any) => {
        this.businessFormList = data;
      },
      () => {
        //this.toastService.error('');;
      }
    );
  }

  getBusinessType(event: any) {
    console.log(event);
  }

  onBusinessSelect(event: any) {
    console.log(event);
  }

  getApiIntegrationRecords() {
    this.businessService
      .getApiIntegrationRecords('BUSINESS_CREATION')
      .then((data: any) => {
        this.businessRecords = data;
        if (this.businessRecords?.id) {
          this.isRecordSaved = true;
          this.businessForm.patchValue({
            url: this.businessRecords?.apiUrl,
            businessFormType: this.businessRecords?.sourceName
              ? Number(this.businessRecords?.sourceName)
              : ''
          });
        } else {
          this.isRecordSaved = false;
          this.businessForm.patchValue({
            url: environment.SERVER_API_URL
          });
        }
      })
      .catch(() => {
        //this.toastService.error('');;
      });
  }

  getApiIntegrationRecordsCount() {
    this.businessService
      .getApiIntegrationHistoryCountRecords('BUSINESS_CREATION')
      .then((data: any) => {
        this.businessConfig.totalItems = data;
      })
      .catch(() => {
        //this.toastService.error('');;
      });
  }

  getApiIntegrationRecordsHistories(config: any) {
    this.businessService
      .getApiIntegrationHistoryRecords(
        'BUSINESS_CREATION',
        config.currentPage,
        config.itemsPerPage
      )
      .then((data: any) => {
        this.businessHistories = data;
      })
      .catch(() => {
        //this.toastService.error('');;
      });
  }

  submitForm() {
    const form: any = {};
    if (this.businessRecords?.id) {
      form['id'] = this.businessRecords?.id;
    }
    form['apiUrl'] = this.businessForm.value.url;
    form['sourceName'] = this.businessForm.value.businessFormType;
    form['type'] = 'BUSINESS_CREATION';

    this.businessService
      .saveApiIntegrationRecords(form)
      .then(() => {
        this.toastService.success('Business integrated successfully');
        this.getApiIntegrationRecords();
      })
      .catch(() => {
        this.toastService.error('Unable to save API details');
      });
  }

  pageChangedForAppointment(event: any) {
    this.businessConfig.currentPage = event;
    const pageConfig: any = { ...this.businessConfig };
    pageConfig.currentPage = event - 1;
    if (pageConfig.currentPage < 0) {
      pageConfig.currentPage = 0;
    }
    console.log(pageConfig, this.businessConfig);
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
      .callAestheticRecords('BUSINESS_CREATION', [JSON.parse(request)], id)
      .then(() => {
        this.getApiIntegrationRecordsHistories(this.businessConfig);
      })
      .catch(() => {
        this.toastService.error('Unable to save Business API details');
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

  disableIntegration(id: any, disable: any) {
    const value = disable != null ? !disable : true;
    this.businessService
      .disableAestheticRecords(id, value)
      .then(() => {
        if (disable) {
          this.toastService.success('API Integration enabled successfully');
        } else {
          this.toastService.success('API Integration disabled successfully');
        }
        this.getApiIntegrationRecords();
        this.getApiIntegrationRecordsHistories(this.businessConfig);
      })
      .catch(() => {
        this.toastService.error('Unable to save Business API details');
      });
  }

  disable(value: any) {
    if (!this.isRecordSaved) {
      return 'Disable';
    }
    if (value && value == true) {
      return 'Disabled';
    }
    return 'Disable';
  }

  enable(value: any) {
    if (!this.isRecordSaved) {
      return 'Enable';
    }
    if (value && value == true) {
      return 'Enable';
    }
    return 'Enabled';
  }

  isDisable(value: any) {
    if (!this.isRecordSaved) {
      return true;
    }
    if (value && value == true) {
      return true;
    }
    return false;
  }

  enabled(value: any) {
    if (!this.isRecordSaved) {
      return true;
    }
    if (value && value == true) {
      return false;
    }
    return true;
  }
}
