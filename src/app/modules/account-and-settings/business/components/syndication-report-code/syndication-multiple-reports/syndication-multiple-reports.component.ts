import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../../services/business.service';

@Component({
  selector: 'app-syndication-multiple-reports',
  templateUrl: './syndication-multiple-reports.component.html',
  styleUrls: ['./syndication-multiple-reports.component.css']
})
export class SyndicationMultipleReportsComponent implements OnInit {
  form: FormGroup;
  @Input() businessInfo: any;
  inputFields: FormArray;
  urlPattern = new RegExp(RegexEnum.httpUrl);

  reportData: any = [];

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private toastMessageService: ToasTMessageService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      inputFields: this.fb.array([])
    });
    this.inputFields = this.form.get('inputFields') as FormArray;

    this.getSyndicationReport();
  }

  getSyndicationReport() {
    this.businessService.getSyndicationReport().then((data: any) => {
      console.log(data);
      this.reportData = data;
      const inputFields = this.form.get('inputFields') as FormArray;

      if (data.length) {
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
        inputFields.push(this.createInputFields());
      }
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
    const deletedItem = this.inputFields.at(index).value;
    this.inputFields.removeAt(index);

    if (deletedItem.id) {
      this.deleteItem(deletedItem);
    }

    if (this.inputFields.length == 0) {
      this.inputFields.push(this.createInputFields());
    }
  }

  deleteItem(deletedItem: any) {
    console.log(deletedItem);
    this.businessService.removeReport(deletedItem.id).then(
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

    this.businessService.addSyndicationReport(formData.inputFields).then(
      (data) => {
        this.toastMessageService.success(
          'Syndication Report added successfully'
        );
        console.log(data);
      },
      () => {
        this.toastMessageService.error(
          'Error while adding the syndication report'
        );
      }
    );
  }
}
