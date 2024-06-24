import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-questionarie',
  templateUrl: './patient-questionarie.component.html',
  styleUrls: ['./patient-questionarie.component.css']
})
export class PatientQuestionarieComponent implements OnChanges {
  @Input() patientId: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'questionnaireName',
    'AppointmentId',
    'questionnaireStatus',
    'createdAt',
    'submittedDate'
  ];
  columns = [
    { header: 'Questionnaire Name', field: 'questionnaireName' },
    { header: 'Appointment ID', field: 'AppointmentId' },
    { header: 'Status', field: 'questionnaireStatus' },
    { header: 'Submitted Date', field: 'submittedDate' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  questionnaires: any = [];
  showAssignNewQuestionnaireForm: boolean = false;
  constructor(
    private patientService: PatientService,
    private router: Router,
    private formatTimeService: FormatTimeService
  ) {}

  ngOnChanges(): void {
    if (this.patientId) this.loadPatientQuestionnaires();
  }

  editViewQuestionnaire(data: any) {
    if (data.questionnaireStatus === 'Submitted') {
      this.router.navigate([
        '/patients/',
        this.patientId,
        'questionnaire',
        data.questionnaireId
      ]);
    }
    if (data.questionnaireStatus === 'Pending') {
      this.router.navigate([
        '/patients/',
        this.patientId,
        'questionnaire',
        data.questionnaireId,
        'fill'
      ]);
    }
  }

  loadPatientQuestionnaires() {
    this.patientService
      .getPatientQuestionnaireOptimized(this.patientId)
      .then((response: any) => {
        this.questionnaires = response;
        console.log('res', this.questionnaires);
      });
  }

  addEditQuestionarie(id?: any) {
    console.log(id);
    if (id) {
      this.router.navigate(
        ['/patients/' + this.patientId + '/questionnaire', id, 'fill'],
        {
          queryParams: {
            source: 'pateint'
          },
          queryParamsHandling: 'merge'
        }
      );
    } else {
      this.router.navigate(['/patients/' + id + 'questionnaire', 'new'], {
        queryParams: {
          source: 'pateint'
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  assignNewQuestionaire() {
    this.showAssignNewQuestionnaireForm = true;
  }

  onQuestionnaireAssign() {
    this.showAssignNewQuestionnaireForm = false;
    this.loadPatientQuestionnaires();
  }

  onQuestionnaireCancel() {
    this.showAssignNewQuestionnaireForm = false;
  }

  formatTime(time: any) {
    return this.formatTimeService.formatTime(time);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
