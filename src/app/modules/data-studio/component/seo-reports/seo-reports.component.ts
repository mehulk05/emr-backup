import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BusinessService } from 'src/app/modules/account-and-settings/business/services/business.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { MenuService } from 'src/app/shared/services/sidebar-menu.service';

@Component({
  selector: 'app-seo-reports',
  templateUrl: './seo-reports.component.html',
  styleUrls: ['./seo-reports.component.css']
})
export class SeoReportsComponent implements OnInit {
  seoUrl: any;
  loggedInUser: any;
  showError: boolean;
  modalState: boolean;
  dashboardAndReportEmail: any;
  seoReportEmail: any;
  seoReportForm!: FormGroup;
  urlPattern = new RegExp(RegexEnum.httpUrl);
  businessInfo: any;

  constructor(
    public formBuilder: FormBuilder,
    private businessService: BusinessService,
    private menuService: MenuService,
    private toastService: ToastrService,
    private localStorageService: LocalStorageService
  ) {}

  get f() {
    return this.seoReportForm.controls;
  }

  ngOnInit(): void {
    console.log('seoAndRepportEmail');

    const userData = this.localStorageService.readStorage('currentUser');
    console.log(userData);
    this.loggedInUser = userData;
    console.log(this.loggedInUser);
    this.loadBusinessData();
    this.loadAgencyConfigurationData();

    this.seoReportForm = this.formBuilder.group({
      seoCode: ['', [Validators.required]]
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
          if (response?.seoCode) {
            this.seoUrl = response?.seoCode;
            this.seoReportForm.patchValue({
              seoCode: this.businessInfo?.seoCode
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
        this.seoReportEmail = response?.seoReportEmail;
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
    if (this.seoReportForm.invalid) {
      this.toastService.error('Please enter correct code');
      return;
    }
    let formData = this.seoReportForm.value;
    const successMsg = isClearForm
      ? 'Source URL Deleted Successfully'
      : 'Source URL Added Successfully';
    if (isClearForm) {
      formData = {
        seoCode: ''
      };
    }
    this.businessService
      .updateBusinessseoCode(this.businessInfo.id, formData)
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
