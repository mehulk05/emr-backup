import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ChatSessionService } from '../../service/chat-session.service';

@Component({
  selector: 'app-chat-session-list',
  templateUrl: './chat-session-list.component.html',
  styleUrls: ['./chat-session-list.component.css']
})
export class ChatSessionListComponent implements OnInit {
  first = 0;
  rows = 10;
  showModal: boolean = false;
  modalData: any;
  globalFilterColumn = [
    'id',
    'firstName',
    'lastName',
    'phone',
    'email',
    'createdAt'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'firstName' },
    { header: 'Email', field: 'email' },
    { header: 'Phone', field: 'phone' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];

  constructor(
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private chatSessionService: ChatSessionService
  ) {}

  ngOnInit(): void {
    this.loadClinics();
  }

  loadClinics() {
    this.chatSessionService
      .getChatSessions()
      .then((data: any) => {
        // this.rowData = data;
        this.rowData = data.filter((clinic: any) => !clinic.deleted);
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load Clnics');
      });
  }

  showSession(chatSession: any) {
    this.router.navigate(['/chat/chat-sessions/' + chatSession.id]);
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

  deleteSessionModal(data: any) {
    this.modalData = { name: data.firstName + data.lastName, id: data.id };
    this.modalData.feildName = data.firstName + ' ' + data.lastName;
    this.modalData.titleName = 'Chat-Session';
    this.showModal = true;
  }
  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteChat(this.modalData.id);
    }
  }

  deleteChat(id: any) {
    this.chatSessionService.deleteChatSession(id).then(
      () => {
        this.rowData = [];
        this.toastMessageService.success(
          'Chat Session is deleted successfully'
        );
        this.loadClinics();
      },
      () => {
        this.toastMessageService.error('Unable to delete a Chat Session');
      }
    );
  }
}
