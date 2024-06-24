import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../../services/patient.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { debounce } from 'lodash';
import { PreviousUrlService } from '../../../services/previous-url.service';
import { UserService } from 'src/app/modules/user/services/user.service';

interface UserData {
  name: string;
  email: string;
  id: any;
}

@Component({
  selector: 'app-patient-detail-middle-tab',
  templateUrl: './patient-detail-middle-tab.component.html',
  styleUrls: ['./patient-detail-middle-tab.component.css']
})
export class PatientDetailMiddleTabComponent implements OnInit {
  @Output() loadTaskList: EventEmitter<any> = new EventEmitter();
  showNotesModal: boolean = true;
  leadStatusForm: FormGroup;
  leadCommentEmailForm: FormGroup;
  patientId: any;
  selectedTag: any;
  tags: any = [];
  tagSelect: boolean;
  leadTasks: any;
  showModal: boolean;
  leadComments: any = [];
  commentValue: boolean;
  comment: any;
  tagId: any = [];
  leadCommentForm: FormGroup;
  patientNotesFile: any;
  showNotesModalValid: boolean = false;

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
  predefinedList: UserData[] = [];
  filteredList: UserData[] = [];
  providerList: any = [];
  showPopup: boolean = false;
  isUserSelectedForNotes: boolean = false;
  selectedUser: UserData;
  userSelected: EventEmitter<UserData> = new EventEmitter<UserData>();

  @ViewChild('commentInput', { static: false }) commentInput!: ElementRef;
  patient: any;
  businessInfo: any;
  constructor(
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private toastService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private previousUrlservice: PreviousUrlService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((data: any) => {
      this.patientId = data.params.patientId;
      this.loadPatientInfo();
      this.loadTasks();
      this.loadPatientComments();
    });
    this.leadStatusForm = this.formBuilder.group({
      tagId: [[], []]
    });

    this.leadCommentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
      patientId: ['', []]
    });

    this.leadCommentEmailForm = this.formBuilder.group({
      leadId: ['', []],
      userId: ['', []],
      message: ['', []]
    });

    this.getAllUsers();

    console.log('PREVIOUS URL: ', this.previousUrlservice.getPreviousUrl());
    if (this.previousUrlservice.getPreviousUrl()) {
      this.showNotesModalValid = true;
    }
    this.previousUrlservice.setPreviousUrl(null);
    this.businessInfo = this.localStorageService.readStorage('businessInfo');
    this.showNotesModal = this.businessInfo?.showNotesPopupOnLeadLoad;
  }

  getAllUsers() {
    this.userService.getAllUsers().then(
      (response: any) => {
        this.providerList = response;
        console.log(this.providerList);
        for (const user of this.providerList) {
          this.predefinedList.push({
            name: user.firstName + ' ' + user.lastName,
            email: user.email,
            id: user.id
          });
        }
      },
      () => {
        this.toastService.error('Unable to load the patient comment.');
      }
    );
  }

  async loadPatientInfo() {
    this.patientService
      .getPatientOptimized(this.patientId)
      .then((response: any) => {
        this.patient = response;
        this.leadStatusForm.patchValue({
          tagId: response.tag
        });

        this.tagId = response.tag;
        if (this.tagId) this.selectedTag = this.tagId.map((x: any) => x.id);
        if (response.tagId != null) {
          response.tagId.forEach((id: any) => {
            this.tagId.push(id);
          });
        }
      });
  }

  loadPatientComments() {
    this.patientService.patientCommentList(this.patientId).then(
      (response: any) => {
        this.leadComments = response;
        this.leadComments.reverse();
      },
      () => {
        this.toastService.error('Unable to load the patient comment.');
      }
    );
  }

  loadTasks() {
    this.patientService.getPatientTask(this.patientId).then(
      (response: any) => {
        console.log(response.taskDTOList);
        this.leadTasks = response.taskDTOList;
        // console.log(this.leadTasks[0]);
      },
      () => {
        this.toastService.error('Unable to load the tasks.');
      }
    );
  }

  onCloseModal(e: any) {
    console.log('e', e);
    this.showModal = false;
    this.loadTasks();
    if (e.isSaved) {
      this.loadTaskList.emit(true);
    }
  }

  addTaskTemplateModal() {
    this.showModal = true;
  }

  commentChange(event: any) {
    this.comment = event.target.value;
    console.log('com', this.comment);
    if (this.comment.length === 0) {
      this.commentValue = true;
    } else {
      this.commentValue = false;
    }
  }

  save() {
    if (this.patientNotesFile != null) {
      this.savelnfile();
      this.patientNotesFile = null;
      this.patientNotesFilelink = '';
    } else {
      this.savebuttonComment();
    }
  }

  savebuttonComment() {
    if (!this.leadCommentForm.valid) {
      this.toastService.error('Please enter note.');
      return;
    }
    const commentValue = this.commentInput.nativeElement.value;
    if (!commentValue) {
      this.commentValue = true;
      return;
    }

    this.leadCommentForm.patchValue({
      patientId: this.patientId,
      comment: commentValue
    });

    // Clear the input field
    this.commentInput.nativeElement.value = '';
    var formData = this.leadCommentForm.value;
    this.patientService.addPaitentComment(formData).then(
      () => {
        this.toastService.success('Notes saved successfully');
        // this.loadPatientInfo();
        if (this.isUserSelectedForNotes) {
          this.sendEmail(this.selectedUser, this.leadCommentForm.value.comment);
          this.isUserSelectedForNotes = false;
        }
        this.loadPatientComments();
        this.leadCommentForm.reset();
        if (this.leadComments.length < 1) {
          if (!this.showNotesModalValid && this.showNotesModal) {
            this.showNotesModalValid = true;
          }
        }
      },
      () => {
        this.toastService.error('Unable to add notes');
      }
    );
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

  savelnfile() {
    if (this.patientNotesFile) {
      const mForm = new FormData();
      mForm.append('patientNotesFile', this.patientNotesFile);
      console.log(mForm);
      this.patientService.savePatientNotesFile(this.patientId, mForm).then(
        () => {
          this.toastService.success('File saved successfully.');
          this.loadPatientComments();
          this.leadCommentForm.reset();
          if (this.leadComments.length < 1) {
            if (!this.showNotesModalValid && this.showNotesModal) {
              this.showNotesModalValid = true;
            }
          }
        },
        () => {
          this.toastService.error('Unable to save file.');
        }
      );
    }
  }

  onLeadNoteCloseModal(e: any) {
    this.showNotesModal = false;
    this.showNotesModalValid = false;
    if (e?.isRefresh) {
      this.loadPatientInfo();

      this.loadPatientComments();
    }
  }
  editTask(id: any) {
    this.router.navigate(['/tasks', id, 'edit'], {
      queryParams: { from: 'task' }
    });
  }
  getInitials(name: string) {
    const words = name.toLowerCase().split(' ');
    const filteredWords = words.filter((word) => word !== '');
    const initials = filteredWords.map((word) => word[0]).join('');
    return initials.toUpperCase();
  }

  onKeydown(e: any) {
    if (!e.shiftKey) {
      e.preventDefault();
    }
    if (this.leadCommentForm.valid) {
      this.savebuttonComment();
    }
  }

  filterList(query: string): UserData[] {
    return this.predefinedList.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
  }

  commentChanged(e: any) {
    debounce(this.changeheight, 200)(e);
    if (this.leadCommentForm.value.comment.includes('@')) {
      // console.log(this.leadCommentForm.value.comment);
      const query = this.leadCommentForm.value.comment.split('@')[1].trim();
      console.log(query);
      this.filteredList = this.filterList(query);
      // console.log(this.filteredList);
      this.showPopup = true;
    } else {
      this.showPopup = false;
    }
  }

  onUserSelected(user: UserData) {
    const atIndex = this.leadCommentForm.value.comment.lastIndexOf('@');
    const commentSubstring =
      this.leadCommentForm.value.comment.substring(0, atIndex + 1) +
      user.name +
      ' ';
    this.leadCommentForm.patchValue({ comment: commentSubstring });
    this.showPopup = false;
    this.isUserSelectedForNotes = true;
    this.selectedUser = user;
    // this.saveComment();
    // this.sendEmail(user);
  }

  sendEmail(user: any, message: String) {
    this.leadCommentEmailForm.patchValue({
      leadId: this.patientId,
      userId: user.id,
      message: message
    });
    // mForm.append('leadId', this.id);
    // mForm.append('userId', user.id);
    console.log(this.leadCommentEmailForm.value);
    var formData = this.leadCommentEmailForm.value;
    this.patientService.sendPatientCommentEmail(formData).then(
      () => {
        this.toastService.success('Email Send successfully.');
      },
      () => {
        this.toastService.error('Unable to send Email.');
      }
    );
  }

  changeheight(e: any) {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }

  getTextAnswerValue(answer: any) {
    return answer ? answer.replace(/\n/g, '<br/>') : '';
  }

  fileChangeEvent(e: any) {
    if (!e?.target || e.target.files?.length <= 0) {
      return;
    }
    if (this.fileTypes.includes(e.target.files[0]?.type)) {
      this.patientNotesFile = e.target.files[0];
      console.log(this.patientNotesFile);
    } else {
      this.toastService.error(
        'Only Image, Pdf, Word Doc, and PPT are supported.'
      );
    }
  }

  deletelnFile() {
    this.patientNotesFile = undefined;
    this.patientNotesFilelink = '';
  }
}
