import { Component, Input, OnInit } from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ChatSessionService } from '../../service/chat-session.service';

@Component({
  selector: 'app-chat-unanswered-question',
  templateUrl: './chat-unanswered-question.component.html',
  styleUrls: ['./chat-unanswered-question.component.css']
})
export class ChatUnansweredQuestionComponent implements OnInit {
  first = 0;
  rows = 10;
  globalFilterColumn = ['id', 'question', 'createdAt'];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Question', field: 'question' },
    { header: 'Created Date', field: 'createdAt' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];

  constructor(
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private chatSessionService: ChatSessionService
  ) {}

  ngOnInit(): void {
    this.loadClinics();
  }

  loadClinics() {
    this.chatSessionService
      .getQuestions()
      .then((data: any) => {
        this.rowData = data;
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load Clnics');
      });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
