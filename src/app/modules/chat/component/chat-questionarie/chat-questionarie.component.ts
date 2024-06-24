import { Component, OnInit } from '@angular/core';
import { ChatQuestionarieService } from '../../service/chat-questionarie.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-questionarie',
  templateUrl: './chat-questionarie.component.html',
  styleUrls: ['./chat-questionarie.component.css']
})
export class ChatQuestionarieComponent implements OnInit {
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'name',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt'
  ];
  columns = [
    // { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Created By', field: 'createdBy', subField: 'firstName' },
    { header: 'Created At', field: 'createdAt' },
    { header: 'Updated By', field: 'updatedBy' },
    { header: 'Updated At', field: 'updatedAt' },
    { header: 'Actions', field: 'actions' }
  ];
  selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  showModal: boolean = false;
  modalData: any;
  isChatQuestionnaireAction = false;

  constructor(
    private chatQuestionaireService: ChatQuestionarieService,
    private alertService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('');
    this.loadChatQuestionnaires();
  }

  formatTime(time: any) {
    return this.formatTimeService.formatTime(time);
  }

  loadChatQuestionnaires() {
    this.chatQuestionaireService.getChatQuestionnaireList().then(
      (response: any) => {
        this.rowData = response;
      },
      () => {
        this.alertService.error('Unable to submit url for scrapping.');
      }
    );
  }

  gotoQuestionnaire(questionnaire: any) {
    if (!this.isChatQuestionnaireAction) {
      this.router.navigate([
        '/chat/chat-questionnaire/' + questionnaire.id + '/edit'
      ]);
    }
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Chat Questionnaire';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteChatQuestionnaire(this.modalData.id);
    }
  }

  deleteChatQuestionnaire(id: any) {
    this.chatQuestionaireService.deleteChatQuestionnaire(id).then(
      () => {
        this.alertService.success('Chat questionnaire deleted successfully.');
        this.loadChatQuestionnaires();
      },
      () => {
        this.alertService.error('Unable to delete Chat questionnaire.');
      }
    );
  }
}
