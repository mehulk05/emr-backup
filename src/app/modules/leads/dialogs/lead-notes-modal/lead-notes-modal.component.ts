import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LeadsService } from '../../service/leads.service';

@Component({
  selector: 'app-lead-notes-modal',
  templateUrl: './lead-notes-modal.component.html',
  styleUrls: ['./lead-notes-modal.component.css']
})
export class LeadNotesModalComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<any>();
  @Input() notes: any;
  @Input() id: any;
  comment: any;
  commentValue: any;
  @ViewChild('commentInput') commentInput: ElementRef;
  patientNotesFile: any;
  fileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/jpg',
    '.gif',
    '.pdf',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  patientNotesFilelink: string;

  constructor(
    private leadService: LeadsService,
    private alertService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    console.log('j');
  }

  hideModal(flag?: boolean) {
    this.modalClosed.emit({ close: true, isRefresh: flag });
    this.showModal = false;
  }

  saveNotes(value: string) {
    if (!value) {
      this.commentValue = true;
      return;
    }
    const formData = {
      questionnaireSubmissionId: this.id,
      comment: value
    };

    this.commentInput.nativeElement.value = this.comment = '';
    this.leadService.addLeadComment(formData).then(
      () => {
        this.alertService.success('Notes save successfully');
        this.hideModal(true);
      },
      () => {
        this.alertService.error('Unable to add notes');
      }
    );
  }

  commentChange(event: any) {
    this.comment = event.target.value;
    if (this.comment.length === 0) {
      this.commentValue = true;
    } else {
      this.commentValue = false;
    }
  }

  getFileIconClass(fileType: string): string {
    if (this.fileTypes.includes(fileType.toLowerCase())) {
      switch (fileType.toLowerCase()) {
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
        case 'image/jpg':
        case '.gif':
          return 'fas fa-file-image';
        case '.pdf':
        case 'application/pdf':
          return 'fas fa-file-pdf';
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          return 'fas fa-file-powerpoint';
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return 'fas fa-file-word';
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          return 'fas fa-file-excel';
        default:
          return 'fas fa-file';
      }
    } else {
      return 'fas fa-file';
    }
  }
}
