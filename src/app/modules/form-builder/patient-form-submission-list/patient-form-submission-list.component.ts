import { Component, Input, OnChanges } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { QuestionarieService } from '../services/questionarie.service';

@Component({
  selector: 'app-patient-form-submission-list',
  templateUrl: './patient-form-submission-list.component.html',
  styleUrls: ['./patient-form-submission-list.component.css']
})
export class PatientFormSubmissionListComponent implements OnChanges {
  @Input() questionnaireId: any;
  globalFilterColumn = ['id', 'patientId', 'createdAt'];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'patientId', field: 'patientId' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Submitted Date', field: 'submittedAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  userId: any;
  data: any;
  isReviewForm: boolean = false;
  businessInfo: any = {};
  constructor(
    private questionnaireService: QuestionarieService,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}
  ngOnChanges(): void {
    console.log('INSIDE PATIENT QUES SUBMISSION');
    if (this.questionnaireId) {
      this.loadPatientQuestionnaireList();
    }
    if (window.location.pathname.includes('review-form')) {
      this.isReviewForm = true;
    }
  }

  loadPatientQuestionnaireList() {
    this.questionnaireService
      .getPatientQuestionnaireSubmissionList(this.questionnaireId)
      .then(
        (data: any) => {
          this.rowData = data.filter((row: any) => row.submittedAt !== null);
        },
        () => {
          this.toastMessageService.error(
            'Unable to load patient Questionnaires.'
          );
        }
      );
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
