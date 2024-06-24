import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/modules/account-and-settings/business/services/business.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { MenuService } from 'src/app/shared/services/sidebar-menu.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-paid-media-reports',
  templateUrl: './paid-media-reports.component.html',
  styleUrls: ['./paid-media-reports.component.css']
})
export class PaidMediaReportsComponent implements OnInit {
  dataStudioUrl: any;
  loggedInUser: any;
  businessInfo: any;
  showError: boolean;
  modalState: boolean;
  paidMediaReportEmail: any;
  paidMediaForm!: FormGroup;
  urlPattern = new RegExp(RegexEnum.httpUrl);

  constructor(
    private businessService: BusinessService,
    private authenticationService: AuthService,
    private menuService: MenuService,
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService
  ) {}

  get f() {
    return this.paidMediaForm.controls;
  }

  ngOnInit(): void {
    this.paidMediaForm = this.formBuilder.group({
      paidMediaCode: [
        '',
        [Validators.required, Validators.pattern(this.urlPattern)]
      ]
    });
    this.authenticationService.currentUser.subscribe((data: any) => {
      this.loggedInUser = data;
      this.loadBusinessData();
      this.loadAgencyConfigurationData();
    });
  }

  loadBusinessData() {
    this.businessService
      .getBusinessOptimized(this.loggedInUser.businessId)
      .then((response: any) => {
        if (response) this.businessInfo = response;
        if (response && response?.paidMediaCode) {
          this.dataStudioUrl = response?.paidMediaCode;
          this.paidMediaForm.patchValue({
            paidMediaCode: response?.paidMediaCode
          });
        } else {
          this.showError = true;
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
        console.log(response);
        this.paidMediaReportEmail = response?.paidMediaReportEmail;
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
    if (this.paidMediaForm.invalid) {
      this.toastService.error('Please enter correct code');
      return;
    }
    let formData = this.paidMediaForm.value;
    if (isClearForm) {
      formData = {
        paidMediaCode: ''
      };
    }
    const successMsg = isClearForm
      ? 'Source URL Deleted Successfully'
      : 'Source URL Added Successfully';
    this.businessService
      .updateBusinessPaidMediaCode(this.businessInfo.id, formData)
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
