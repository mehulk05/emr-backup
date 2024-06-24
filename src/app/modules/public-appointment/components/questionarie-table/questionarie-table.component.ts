import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';

@Component({
  selector: 'app-questionarie-table',
  templateUrl: './questionarie-table.component.html',
  styleUrls: ['./questionarie-table.component.css']
})
export class QuestionarieTableComponent implements OnInit {
  first = 0;
  rows = 10;
  iframeUrl = '';

  @Input() questionnaires: any;
  @Input() booking: any;
  showModal: boolean;

  @Output() afterQuestionSubmit = new EventEmitter<any>();
  patientId: any;
  constructor(private formatTimeService: FormatTimeService) {}

  ngOnInit(): void {
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  handleMessage(e: any) {
    console.log(e.data);
    if (e && e.data?.message === 'questionarie') {
      this.showModal = false;
      this.afterQuestionSubmit.emit(true);
    }
  }

  editViewQuestionnaire(flag: any) {
    this.iframeUrl = '';
    this.iframeUrl =
      location.protocol +
      '//' +
      location.hostname +
      (location.port ? ':' + location.port : '');
    this.patientId = flag.patientId;
    console.log(flag);
    if (flag.submittedDate) {
      this.showModal = false;
    } else {
      this.showModal = true;
      this.iframeUrl =
        this.iframeUrl +
        '/assets/static/form.html?bid=' +
        this.booking?.businessId +
        '&fid=' +
        flag.questionnaireId +
        '&aptId=' +
        this.booking?.appointment?.id +
        '&pqid=' +
        flag.id +
        '&patientId=' +
        this.patientId +
        '&sendSource=true';
    }
    console.log(this.iframeUrl);
  }

  hideModal() {
    this.showModal = false;
  }
}
