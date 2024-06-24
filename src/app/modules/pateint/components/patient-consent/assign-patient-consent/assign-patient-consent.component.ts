import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ConsentService } from '../../../services/consent.service';
import { QuestionarieService } from '../../../services/questionarie.service';

@Component({
  selector: 'app-assign-patient-consent',
  templateUrl: './assign-patient-consent.component.html',
  styleUrls: ['./assign-patient-consent.component.css']
})
export class AssignPatientConsentComponent implements OnInit {
  first = 0;
  rows = 10;
  globalFilterColumn = ['id', 'Select', 'name'];

  columns = [
    { header: 'Select', field: 'Select' },
    { header: 'Consent Id', field: 'id' },
    { header: 'Consent Name', field: 'name' }
  ];

  _selectedColumns: any[] = this.columns;

  @Input() patientId: any;
  @Output() handleConsentAssign = new EventEmitter();
  @Output() handleCancel = new EventEmitter();
  consents: any = [];
  consentIds: any = [];
  constructor(
    private questionarieService: QuestionarieService,
    private toastService: ToasTMessageService,
    private consentService: ConsentService
  ) {}

  ngOnInit(): void {
    this.loadConsents();
  }

  loadConsents() {
    this.consentService.getAllConsentListOptimized().then(
      (response: any) => {
        this.consents = response;
      },
      () => {
        this.toastService.error('Unable to load consent list.');
      }
    );
  }

  selectCheckbox(event: any, consentId: any) {
    console.log(event.target.checked);
    if (event.target.checked) {
      this.consentIds.push(consentId);
    } else {
      var index = this.consentIds.indexOf(consentId);
      if (index !== -1) {
        this.consentIds.splice(index, 1);
      }
    }
  }

  sendConsentToPatient() {
    this.consentService
      .assignConsentsToPatient(this.patientId, this.consentIds)
      .then(
        (response: any) => {
          if (response.length == 0) {
            this.toastService.success(
              'Consents already sent to patient before.'
            );
          } else {
            this.toastService.success('Consent(s) Sent Successfully.');
          }

          this.handleConsentAssign.emit({ length: response.length });
        },
        () => {
          this.toastService.error('Unable to assign consents to patient.');
        }
      );
  }

  back() {
    this.handleCancel.emit();
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
