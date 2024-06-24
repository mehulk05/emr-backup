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
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-notes-modal',
  templateUrl: './patient-notes-modal.component.html',
  styleUrls: ['./patient-notes-modal.component.css']
})
export class PatientNotesModalComponent implements OnInit {
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
    private patientService: PatientService,
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

  save() {
    if (this.patientNotesFile != null) {
      this.savelnfile();
      this.patientNotesFile = null;
      this.patientNotesFilelink = '';
    } else {
      this.saveNotes();
    }
  }

  saveNotes() {
    const commentValue = this.commentInput.nativeElement.value;
    if (!commentValue) {
      this.commentValue = true;
      return;
    }
    const formData = {
      patientId: this.id,
      comment: commentValue
    };

    this.commentInput.nativeElement.value = this.comment = '';
    this.patientService.addPaitentComment(formData).then(
      () => {
        this.alertService.success('Notes Saved Successfully');
        this.hideModal(true);
      },
      () => {
        this.alertService.error('Unable to add notes');
      }
    );
  }

  savelnfile() {
    if (this.patientNotesFile) {
      const mForm = new FormData();
      mForm.append('patientNotesFile', this.patientNotesFile);
      console.log(mForm);
      this.patientService.savePatientNotesFile(this.id, mForm).then(
        () => {
          this.alertService.success('File saved successfully.');
          this.hideModal(true);
        },
        () => {
          this.alertService.error('Unable to save file.');
        }
      );
    }
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

  fileChangeEvent(e: any) {
    if (!e?.target || e.target.files?.length <= 0) {
      return;
    }
    if (this.fileTypes.includes(e.target.files[0]?.type)) {
      this.patientNotesFile = e.target.files[0];
      console.log(this.patientNotesFile);
    } else {
      this.alertService.error(
        'Only Image, Pdf, Word Doc, and PPT are supported.'
      );
    }
  }

  deletelnFile() {
    this.patientNotesFile = undefined;
    this.patientNotesFilelink = '';
  }
}
