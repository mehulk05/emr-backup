import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { BusinessService } from 'src/app/modules/public-appointment/services/business.service';
import { BusinessService as Bs } from 'src/app/modules/account-and-settings/business/services/business.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { MenuService } from 'src/app/shared/services/sidebar-menu.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-syndication-multiple-reports-preview',
  templateUrl: './syndication-multiple-reports-preview.component.html',
  styleUrls: ['./syndication-multiple-reports-preview.component.css']
})
export class SyndicationMultipleReportsPreviewComponent implements OnInit {
  sReportUrl: any;
  loggedInUser: any;
  showError: boolean;
  reportURLArray: any;
  syndicationReportEmail: any;
  form: FormGroup;
  inputFields: FormArray;
  urlPattern = new RegExp(RegexEnum.httpUrl);
  reportData: any = [];
  modalState: boolean;
  reportType: number;
  showDeleteReportModal: boolean;
  showReportModalData: any;

  constructor(
    private businessService: BusinessService,
    private authenticationService: AuthService,
    private menuService: MenuService,
    private fb: FormBuilder,
    private bs: Bs,
    private toastMessageService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.getStateData();
  }

  getStateData() {
    this.form = this.fb.group({
      inputFields: this.fb.array([])
    });
    this.inputFields = this.form.get('inputFields') as FormArray;

    this.authenticationService.currentUserSubject.subscribe((data: any) => {
      this.loggedInUser = data;
      this.getSyndicationReport();
      this.loadAgencyConfigurationData();
    });
  }

  getSyndicationReport() {
    this.showError = false;
    this.businessService.getSyndicationReport().then(
      (data: any) => {
        this.reportData = data;
        const inputFields = this.form.get('inputFields') as FormArray;
        this.reportURLArray = data;
        if (data.length > 0) {
          this.reportType = Number(data[0].id);
          this.sReportUrl = data[0].reportUrl;
          data.forEach((fieldData: any) => {
            if (fieldData.reportName && fieldData.reportUrl) {
              inputFields.push(
                this.patchValue(
                  fieldData.reportName,
                  fieldData.reportUrl,
                  fieldData.id
                )
              );
            }
          });
        } else {
          this.showError = true;
          inputFields.push(this.createInputFields());
        }
        console.log(data, this.reportType);
      },
      () => {
        this.showError = true;
      }
    );
  }

  onReportSelect(e: any) {
    this.reportType = e.value;
    const selectedReport = this.reportURLArray.find(
      (report: any) => report.id === this.reportType
    );
    this.sReportUrl = selectedReport.reportUrl;
    // Use the report URL as needed
  }

  loadAgencyConfigurationData() {
    console.log('Entered In loadAgencyConfigurationData()');
    console.log('Entered In line no 63');

    this.menuService
      .getAgencyConfiguration(this.loggedInUser.agencyId)
      .then((response: any) => {
        console.log(response);
        this.syndicationReportEmail = response?.syndicationReportEmail;
      });
  }

  createInputFields() {
    return this.fb.group({
      id: [],
      reportName: ['', [Validators.required]],
      reportUrl: [
        '',
        [Validators.required, Validators.pattern(this.urlPattern)]
      ]
    });
  }

  private patchValue(
    reportName: string,
    reportUrl: string,
    id: string
  ): FormGroup {
    return this.fb.group({
      id: [id],
      reportName: [reportName],
      reportUrl: [reportUrl]
    });
  }

  addInputFields() {
    this.form.markAllAsTouched();
    if (this.checkDuplicateReportName()) {
      this.toastMessageService.warn(
        'The report name should be unique for each Report Url.'
      );
      return;
    }

    if (this.form.valid) {
      this.inputFields.push(this.createInputFields());
    }
  }

  checkDuplicateReportName() {
    const reportNames = this.inputFields.value.map(
      (report: any) => report.reportName
    );
    var isDuplicate: boolean = reportNames.some(function (
      item: any,
      idx: number
    ) {
      return reportNames.indexOf(reportNames[idx]) != idx;
    });

    return isDuplicate;
  }

  removeInputFields(index: number) {
    this.showDeleteReportModal = true;
    this.showReportModalData = {
      titleName: 'Syndication Source',
      index: index,
      feildName: 'code for syndication report'
    };
  }

  onDeleteReportModalClose(e: any) {
    if (e.isDelete) {
      const deletedItem = this.inputFields.at(
        this.showReportModalData.index
      ).value;
      this.inputFields.removeAt(this.showReportModalData.index);

      if (deletedItem.id) {
        this.deleteItem(deletedItem);
      }

      if (this.inputFields.length == 0) {
        this.inputFields.push(this.createInputFields());
      }
    }
    this.showDeleteReportModal = false;
  }

  deleteItem(deletedItem: any) {
    console.log(deletedItem);
    this.bs.removeReport(deletedItem.id).then(
      () => {
        this.toastMessageService.success(
          'Syndication Report deleted successfully'
        );
      },
      () => {
        this.toastMessageService.error(
          'Error while deleting the syndication report'
        );
      }
    );
  }

  submitForm() {
    console.log(this.form.value);
    this.form.markAllAsTouched();
    if (this.checkDuplicateReportName()) {
      this.toastMessageService.warn(
        'The Location should be unique for each Report Url.'
      );
      return;
    }

    if (this.form.invalid) {
      return;
    }

    const formData: any = this.form.value;

    this.bs.addSyndicationReport(formData.inputFields).then(
      (data) => {
        this.toastMessageService.success(
          'Syndication Report added successfully'
        );
        this.getStateData();
        console.log(data);
        this.modalState = false;
      },
      () => {
        this.toastMessageService.error(
          'Error while adding the syndication report'
        );
      }
    );
  }

  openModal(): void {
    this.getStateData();
    this.modalState = true;
  }

  closeModal(): void {
    this.getStateData();
    this.modalState = false;
  }
  onCancelclick() {
    this.modalState = false;
  }
}
