import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BusinessService } from 'src/app/modules/account-and-settings/business/services/business.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { MenuService } from 'src/app/shared/services/sidebar-menu.service';

@Component({
  selector: 'app-data-studio-report',
  templateUrl: './data-studio-report.component.html',
  styleUrls: ['./data-studio-report.component.css']
})
export class DataStudioReportComponent implements OnInit {
  dataStudioUrl: any;
  loggedInUser: any;
  showError: boolean;
  modalState: boolean;
  dashboardAndReportEmail: any;
  dataStudioForm!: FormGroup;
  urlPattern = new RegExp(RegexEnum.httpUrl);
  businessInfo: any;

  constructor(
    public formBuilder: FormBuilder,
    private businessService: BusinessService,
    private authenticationService: AuthService,
    private menuService: MenuService,
    private toastService: ToastrService,
    private localStorageService: LocalStorageService
  ) {}

  get f() {
    return this.dataStudioForm.controls;
  }

  ngOnInit(): void {
    console.log('dashboardAndReportEmail');

    const userData = this.localStorageService.readStorage('currentUser');
    console.log(userData);
    this.loggedInUser = userData;
    console.log(this.loggedInUser);
    this.loadBusinessData();
    this.loadAgencyConfigurationData();

    this.dataStudioForm = this.formBuilder.group({
      dataStudioCode: [
        '',
        [Validators.required, Validators.pattern(this.urlPattern)]
      ]
    });
  }

  loadBusinessData() {
    this.businessService
      .getBusinessOptimized(this.loggedInUser.businessId)
      .then((response: any) => {
        console.log(response);
        if (response) {
          this.businessInfo = response;
          this.localStorageService.storeItem('businessInfo', this.businessInfo);
          if (response?.dataStudioCode) {
            this.dataStudioUrl = response?.dataStudioCode;
            this.dataStudioForm.patchValue({
              dataStudioCode: this.businessInfo?.dataStudioCode
            });
          } else {
            this.showError = true;
          }
        }
      })
      .catch(() => {
        this.showError = true;
      });
  }

  loadAgencyConfigurationData() {
    console.log('Entered In loadAgencyConfigurationData()');
    this.menuService
      .getAgencyConfiguration(this.loggedInUser.agencyId)
      .then((response: any) => {
        console.log('line no 53');
        console.log(response);
        this.dashboardAndReportEmail = response?.dashboardAndReportEmail;
        console.log('dashboardAndReportEmail ' + this.dashboardAndReportEmail);
      });
  }

  openModal(): void {
    this.loadBusinessData();
    this.modalState = true;
  }

  closeModal(): void {
    this.modalState = false;
  }

  deleteCodeInDataStudio() {
    this.submitForm(true);
  }
  submitForm(isClearForm?: any) {
    if (this.dataStudioForm.invalid) {
      this.toastService.error('Please enter correct code');
      return;
    }
    let formData = this.dataStudioForm.value;
    const successMsg = isClearForm
      ? 'Source URL Deleted Successfully'
      : 'Source URL Added Successfully';
    if (isClearForm) {
      formData = {
        dataStudioCode: ''
      };
    }
    this.businessService
      .updateBusinessDataStudioCode(this.businessInfo.id, formData)
      .then(
        () => {
          localStorage.removeItem('sidebarData');
          setTimeout(() => {
            this.toastService.success(successMsg);
          }, 200);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        () => {
          this.toastService.error('Unable to update  information.');
        }
      );
  }
  onCancelclick() {
    this.modalState = false;
  }
}
