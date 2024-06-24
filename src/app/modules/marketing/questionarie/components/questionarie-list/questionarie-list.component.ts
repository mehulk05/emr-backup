import { Component, Input, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { QuestionariePageService } from '../../services/questionarie-page.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-questionarie-list',
  templateUrl: './questionarie-list.component.html',
  styleUrls: ['./questionarie-list.component.css']
})
export class QuestionarieListComponent implements OnInit {
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
  showModal: boolean = false;
  modalData: any;
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
    this.bid = this.localStorageService.readStorage('businessData')?.id;
  }

  loadQuestionarie() {
    this.questionarieService.getAllQuestionnaireListOptimized().then(
      (data: any) => {
        this.rowData = data;
      },
      () => {
        this.toastMessageService.error('Unable to load Questionaires.');
      }
    );
  }

  navigateTo() {
    const queryParams = { from: 'questionarie-list' };
    const urlTree: UrlTree = this.router.createUrlTree(
      ['/form-builder/create'],
      { queryParams }
    );
    const url: string = urlTree.toString();
    this.router.navigateByUrl(url);
  }

  editTemplate(id: any) {
    const queryParams = { source: 'designer', from: 'questionarie-list' };
    this.router.navigate(['form-builder', id, 'edit'], { queryParams });
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
