import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { QuestionariePageService } from '../../services/questionarie-page.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  type = 'REVIEW';
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'name',
    'noOfQuestions',
    'createdAt',
    'updatedAt'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Number Of Questions', field: 'noOfQuestions' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  userId: any;
  data: any;
  bid: any;
  constructor(
    private questionarieService: QuestionariePageService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loadQuestionarie();
    this.bid = this.localStorageService.readStorage('businessInfo')?.id;
  }

  loadQuestionarie() {
    this.questionarieService
      .getAllQuestionnaireListOptimizedOfType(this.type)
      .then(
        (data: any) => {
          this.rowData = data;
        },
        () => {
          this.toastMessageService.error('Unable to load Questionaires.');
        }
      );
  }

  navigateTo() {
    this.router.navigate(['/review-form/create'], {
      queryParams: { type: this.type },
      queryParamsHandling: 'merge'
    });
  }

  editTemplate(id: any) {
    this.router.navigate(['review-form', id, 'edit'], {
      queryParams: { type: this.type },
      queryParamsHandling: 'merge'
    });
  }

  deleteTemplateModal(data: any) {
    this.data = data;
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Questionnaire';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteQuestionaire(this.modalData.id);
    }
  }

  deleteQuestionaire(id: any) {
    this.questionarieService.deleteQuestionarie(id).then(
      () => {
        this.rowData = [];
        this.toastMessageService.success('The Questionnaire has been deleted.');
        this.loadQuestionarie();
      },
      () => {
        this.toastMessageService.error('Unable to delete Questionnaire.');
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

  previewUrl(formId: string) {
    const domain = environment.NEW_UI_DOMAIN;
    window.open(
      `${domain}/assets/static/form.html?bid=${this.bid}&fid=${formId}`,
      '_blank'
    );
  }
}
