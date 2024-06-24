import { Component, Input, OnChanges } from '@angular/core';
import { QuestionarieService } from '../services/questionarie.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
@Component({
  selector: 'app-questionnaire-submission-list',
  templateUrl: './questionnaire-submission-list.component.html',
  styleUrls: ['./questionnaire-submission-list.component.css']
})
export class QuestionnaireSubmissionListComponent implements OnChanges {
  @Input() questionnaireId: any;
  globalFilterColumn = [
    'id',
    // 'email',
    'createdAt',
    'updatedAt'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    // { header: 'Email', field: 'email' },
    // { header: 'Created Date', field: 'createdAt' },
    // { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Submitted Date', field: 'createdAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  userId: any;
  data: any;

  constructor(
    private questionnaireService: QuestionarieService,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnChanges(): void {
    if (this.questionnaireId) {
      this.loadQuestionarieSubmissionList();
    }
  }

  loadQuestionarieSubmissionList() {
    this.questionnaireService
      .getAllQuestionnaireSubmissionById(this.questionnaireId)
      .then(
        (data: any) => {
          this.rowData = data;
        },
        () => {
          this.toastMessageService.error('Unable to load Questionaires.');
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
