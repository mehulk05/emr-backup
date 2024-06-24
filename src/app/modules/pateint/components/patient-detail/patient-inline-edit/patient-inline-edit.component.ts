import { Component, EventEmitter, Input, Output } from '@angular/core';
import moment from 'moment';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-patient-inline-edit',
  templateUrl: './patient-inline-edit.component.html',
  styleUrls: ['./patient-inline-edit.component.css']
})
export class PatientInlineEditComponent {
  @Input() field: any;
  @Input() value: any;
  @Input() inputType: any;
  @Input() options: any[];
  @Input() patientId: string | number;

  @Output() afterInlineEditComplete = new EventEmitter<any>();
  isEditMode = false;
  inlineEditObj: any = {};
  hasError: boolean;
  constructor(
    public patientService: PatientService,
    public alertService: ToasTMessageService
  ) {}

  showInlineEdit(field: any, value: any) {
    this.inlineEditObj = {
      field: field,
      value: value
    };
    this.isEditMode = true;
    if (this.inputType === 'date') {
      this.value = moment(this.inlineEditObj.value).format('yyyy-MM-DD');
      console.log(value, field, this.inlineEditObj, this.inputType);
    }
  }

  saveValue() {
    if (this.inputType === 'date') {
      console.log(this.inlineEditObj);
      const date = this.inlineEditObj.value;
      if (date) {
        if (moment(date).isValid()) {
          const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
          this.inlineEditObj.value = moment.utc(formattedDate).format();
        } else {
          this.inlineEditObj.value = '';
        }
      }
    }
    console.log(this.inlineEditObj);
    this.isEditMode = false;
    this.saveInlineEdits();
    // inside the success of api call send the event Emitter
  }

  saveInlineEdits() {
    const formData: any = {};
    formData[this.inlineEditObj.field] = this.inlineEditObj.value;
    this.patientService
      .editInlinePaitent(formData, this.patientId)
      .then(() => {
        this.alertService.success('Patient Edited successfully !');
        this.afterInlineEditComplete.emit(this.inlineEditObj);
      })
      .catch(() => {
        this.alertService.error('Error while editing Paitent !');
      });
  }

  onInput(e: any) {
    const val = e.target.value;
    if (this.field === 'email') {
      const regex = new RegExp(RegexEnum.email);
      this.hasError = !regex.test(val);
    } else if (this.field === 'phone') {
      const regex = new RegExp(RegexEnum.phone);
      this.hasError = !regex.test(val);
    } else if (this.field === 'firstName' || this.field === 'lastName') {
      const regex = new RegExp(RegexEnum.textFeild);
      this.hasError = !regex.test(val) || !(val.trim().length > 0);
    }
  }
}
