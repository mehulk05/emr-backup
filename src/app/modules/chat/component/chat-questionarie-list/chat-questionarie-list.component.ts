import { Component, OnInit } from '@angular/core';
import { ChatQuestionarieService } from '../../service/chat-questionarie.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-questionarie-list',
  templateUrl: './chat-questionarie-list.component.html',
  styleUrls: ['./chat-questionarie-list.component.css']
})
export class ChatQuestionarieListComponent implements OnInit {
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'question',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt'
  ];
  columns = [
    // { header: 'Id', field: 'id' },
    { header: ' Question', field: 'question' },
    {
      header: 'Created By',
      field: 'createdBy',
      subField: 'firstName',
      questionnaireLevel: 'chatQuestionnaire'
    },
    { header: 'Created At', field: 'createdAt' },
    { header: 'Updated By', field: 'updatedBy' },
    { header: 'Updated At', field: 'updatedAt' },
    { header: 'Actions', field: 'actions' }
  ];
  selectedColumns: any[] = this.columns;
  rowData: any = {};
  questionList: any = {};
  showModal: boolean = false;
  showCreateEditModal: boolean = false;
  modalData: any;
  createEditModalData: any;
  isChatQuestionnaireAction = false;
  chatQuestionnaireId: any = null;

  constructor(
    private chatQuestionaireService: ChatQuestionarieService,
    private alertService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((routeParams) => {
      this.chatQuestionnaireId = routeParams.chatQuestionnaireId;
      if (this.chatQuestionnaireId != null) {
        this.loadChatQuestions();
      }
    });
  }

  loadChatQuestions() {
    this.chatQuestionaireService.getQuestions(this.chatQuestionnaireId).then(
      (response) => {
        this.rowData = response;
        this.rowData = this.questionList = response;
      },
      () => {
        this.alertService.error('Unable to load questions.');
      }
    );
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.question;
    this.modalData.titleName = 'Question';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteSelectedQuestion(this.modalData.id);
    }
  }

  deleteSelectedQuestion(id: any) {
    this.chatQuestionaireService
      .deleteQuestion(this.chatQuestionnaireId, id)
      .then(
        () => {
          this.alertService.success('Question deleted successfully.');
          this.loadChatQuestions();
        },
        () => {
          this.alertService.error('Unable to delete question.');
        }
      );
  }

  createEditTemplateModal(data: any) {
    this.createEditModalData = {
      data: data,
      chatQuestionnaireId: this.chatQuestionnaireId
    };
    this.showCreateEditModal = true;
    this.createEditModalData.titleName = 'Edit New Chat Question';
  }

  onCloseCreateEditModal() {
    this.showCreateEditModal = false;
    this.loadChatQuestions();
  }

  createTemplateModal() {
    this.createEditModalData = {
      data: {
        id: null
      },
      chatQuestionnaireId: this.chatQuestionnaireId
    };
    this.showCreateEditModal = true;
    this.createEditModalData.titleName = 'Add New Chat Question';
  }
}
