import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { PatientDashboardService } from '../../service/patient-dashboard.service';

@Component({
  selector: 'app-patient-questionarie',
  templateUrl: './patient-questionarie.component.html',
  styleUrls: ['./patient-questionarie.component.css']
})
export class PatientQuestionarieComponent implements OnChanges {
  @Input() currentPaitent: any;
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
    private patientService: PatientDashboardService,
    private router: Router,
    private formatTimeService: FormatTimeService
  ) {}

  ngOnChanges(): void {
    if (this.currentPaitent) this.loadPatientQuestionnaires();
  }

  editViewQuestionnaire(data: any) {
    if (data.questionnaireStatus === 'Submitted') {
      this.router.navigate([
        '/patient-portal/patient/',
        this.currentPaitent?.id,
        'questionnaire',
        data.questionnaireId
      ]);
    }
    if (data.questionnaireStatus === 'Pending') {
      this.router.navigate([
        '/patient-portal/patient/',
        this.currentPaitent?.id,
        'questionnaire',
        data.questionnaireId
      ]);
    }
  }

  loadPatientQuestionnaires() {
    this.patientService
      .getPatientQuestionnaireOptimized(this.currentPaitent?.id)
      .then((response: any) => {
        this.questionnaires = response;
        console.log('res', this.questionnaires);
      });
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
