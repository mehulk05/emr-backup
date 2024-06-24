import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ApiIntegrationService } from '../../services/api-integration.service';
import moment from 'moment';

@Component({
  selector: 'app-modmed',
  templateUrl: './modmed.component.html',
  styleUrls: ['./modmed.component.css']
})
export class ModmedComponent implements OnInit {
  showModal = false;
  detailsMessage = '';
  headerName = '';
  modmedRecords: any = {};
  apiIntegration: FormGroup;
  modmedHistories: any = [];
  totalItems = 0;
  isRecordSaved = false;
  frequency = [
    { name: 'daily', job: '0 0 3 1/1 * ? *' },
    { name: 'weekly', job: '0 0 1 ? * SUN *' },
    { name: 'monthly', job: '0 0 1 1 1/1 ? *' }
  ];
  HubspotConfig: any = {
    itemsPerPage: 10,
    currentPage: 0,
    id: 8,
    totalItems: 0
  };

  constructor(
    private apiIntegrationService: ApiIntegrationService,
    private toastService: ToasTMessageService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.apiIntegration = this.formBuilder.group({
      url: ['', []],
      authUrl: ['', []],
      userName: ['', []],
      password: ['', []],
      firmName: ['', []],
      apiKey: ['', []],
      frequency: ['0 0 3 1/1 * ? *', []],
      lastUpdatedDate: [new Date(), []]
    });

    this.getApiIntegrationRecordsCount();
    this.getApiIntegrationRecords();
    this.getApiIntegrationRecordsHistories(this.HubspotConfig);
  }

  getApiIntegrationRecords() {
    this.apiIntegrationService
      .getApiIntegrationRecords('MODMED')
      .then((data: any) => {
        this.modmedRecords = data;
        if (this.modmedRecords?.id) {
          this.isRecordSaved = true;
          this.apiIntegration.patchValue({
            url: this.modmedRecords?.apiUrl,
            authUrl: this.modmedRecords?.authUrl,
            userName: this.modmedRecords?.userName,
            password: this.modmedRecords?.password,
            firmName: this.modmedRecords?.firmName,
            apiKey: this.modmedRecords?.apiKey,
            frequency: this.modmedRecords?.frequency,
            lastUpdatedDate: new Date(this.modmedRecords?.lastUpdatedDate)
          });
        } else {
          this.isRecordSaved = false;
          this.apiIntegration.patchValue({
            url: 'https://stage.ema-api.com/ema-dev',
            authUrl:
              'https://stage.ema-api.com/ema-dev/firm/entpmsandbox431/ema/ws/oauth2/grant'
          });
        }
      })
      .catch(() => {
        this.toastService.error('Unable to get API details');
      });
  }

  getApiIntegrationRecordsCount() {
    this.apiIntegrationService
      .getApiIntegrationHistoryCountRecords('MODMED')
      .then((data: any) => {
        this.HubspotConfig.totalItems = data;
      })
      .catch(() => {
        this.toastService.error('Unable to get API details');
      });
  }

  getApiIntegrationRecordsHistories(config: any) {
    this.apiIntegrationService
      .getApiIntegrationHistoryRecords(
        'MODMED',
        config.currentPage,
        config.itemsPerPage
      )
      .then((data: any) => {
        this.modmedHistories = data;
      })
      .catch(() => {
        this.toastService.error('Unable to get API details');
      });
  }

  submitForm() {
    const form: any = {};
    if (this.modmedRecords?.id) {
      form['id'] = this.modmedRecords?.id;
    }
    form['token'] = this.apiIntegration.value.token;
    form['apiUrl'] = this.apiIntegration.value.url;
    form['authUrl'] = this.apiIntegration.value.authUrl;
    form['userName'] = this.apiIntegration.value.userName;
    form['password'] = this.apiIntegration.value.password;
    form['firmName'] = this.apiIntegration.value.firmName;
    form['apiKey'] = this.apiIntegration.value.apiKey;
    form['frequency'] = this.apiIntegration.value.frequency;
    form['lastUpdatedDate'] = moment(this.apiIntegration.value.lastUpdatedDate)
      .utcOffset(0, true)
      .format('YYYY-MM-DD');

    form['type'] = 'MODMED';

    this.apiIntegrationService
      .saveApiIntegrationRecords(form)
      .then(() => {
        this.toastService.success('Modmed integrated successfully');
        this.getApiIntegrationRecords();
      })
      .catch(() => {
        this.toastService.error('Unable to save API details');
      });
  }

  pageChangedForAppointment(event: any) {
    this.HubspotConfig.currentPage = event;
    const pageConfig: any = { ...this.HubspotConfig };
    pageConfig.currentPage = event - 1;
    if (pageConfig.currentPage < 0) {
      pageConfig.currentPage = 0;
    }
    console.log(pageConfig, this.HubspotConfig);
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
    this.apiIntegrationService
      .callAestheticRecords('MODMED', [JSON.parse(request)], id)
      .then(() => {
        this.getApiIntegrationRecordsHistories(this.HubspotConfig);
      })
      .catch(() => {
        this.toastService.error('Unable to save Modmed API details');
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
