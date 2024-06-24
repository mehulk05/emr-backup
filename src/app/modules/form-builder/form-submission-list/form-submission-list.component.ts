import { Component, Input, OnChanges } from '@angular/core';
import { QuestionarieService } from '../services/questionarie.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-form-submission-list',
  templateUrl: './form-submission-list.component.html',
  styleUrls: ['./form-submission-list.component.css']
})
export class FormSubmissionListComponent implements OnChanges {
  @Input() questionnaireId: any;
  isReviewForm = false;
  reviewFormType = 'REVIEW';
  globalFilterColumn = [
    'id',
    // 'email',
    'createdAt'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Email', field: 'email' },
    { header: 'Business Name', field: 'businessName' },
    // { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Submitted Date', field: 'createdAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  userId: any;
  data: any;
  businessInfo: any = {};
  constructor(
    private questionnaireService: QuestionarieService,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnChanges(): void {
    this.businessInfo = this.localStorageService.readStorage('businessInfo');
    if (this.questionnaireId) {
      this.loadQuestionarieSubmissionList();
    }
    if (window.location.pathname.includes('review-form')) {
      this.isReviewForm = true;
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
