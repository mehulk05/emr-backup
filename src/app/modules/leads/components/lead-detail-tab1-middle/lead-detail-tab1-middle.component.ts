import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { LeadsService } from '../../service/leads.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { UserService } from 'src/app/modules/user/services/user.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounce } from 'lodash';
// import { Injectable,  } from '@angular/core';

interface UserData {
  name: string;
  email: string;
  id: any;
}

@Component({
  selector: 'app-lead-detail-tab1-middle',
  templateUrl: './lead-detail-tab1-middle.component.html',
  styleUrls: ['./lead-detail-tab1-middle.component.css']
})
// @Injectable({
//   providedIn: 'root',
// })
export class LeadDetailTab1MiddleComponent implements OnInit {
  id: any = null;
  tempTab: string;
  showTaskTemplateModal: boolean = false;
  modalData: any;
  leadCommentForm: FormGroup;
  leadStatusForm: FormGroup;
  leadCommentEmailForm: FormGroup;
  leadComments: any = [];
  leadTasks: any = [];
  isLoading: boolean;
  leadNotesFile: any;
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
  leadNotesFilelink: string;

  predefinedList: UserData[] = [];

  filteredList: UserData[] = [];
  providerList: any = [];
  showPopup: boolean = false;
  isUserSelectedForNotes: boolean = false;
  selectedUser: UserData;
  userSelected: EventEmitter<UserData> = new EventEmitter<UserData>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private leadService: LeadsService,
    public formBuilder: FormBuilder,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((data: any) => {
      this.id = data.params.leadId;
      // this.loadQuestionnaireSubmission();
      this.isLoading = true;
      this.leadComments = [];
      this.leadTasks = [];
      setTimeout(() => {
        this.loadLeadCommentAndTask();
      }, 2000);
    });
    this.leadCommentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
      questionnaireSubmissionId: [this.id, []]
    });

    this.leadStatusForm = this.formBuilder.group({
      leadStatus: ['NEW', [Validators.required]],
      tagId: [[], []]
    });

    this.leadCommentEmailForm = this.formBuilder.group({
      leadId: ['', []],
      userId: ['', []],
      message: ['', []]
    });

    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().then(
      (response: any) => {
        this.providerList = response;
        console.log(this.providerList);
        for (const user of this.providerList) {
          // console.log(`Name: ${user.name}, Email: ${user.email}`);
          this.predefinedList.push({
            name: user.firstName + ' ' + user.lastName,
            email: user.email,
            id: user.id
          });
        }
      },
      () => {
        this.alertService.error(
          'Unable to load the questionnaire submission comment.'
        );
      }
    );
  }

  getTextAnswerValue(answer: any) {
    return answer ? answer.replace(/\n/g, '<br/>') : '';
  }

  loadLeadCommentAndTask() {
    this.leadService.getLeadCommentsAndTask(this.id).then(
      (data: any) => {
        if (data) {
          // Handle leadComments API response
          this.leadComments = data.commentList;

          // Handle leadTasks API response
          this.leadTasks = data.tasks.taskDTOList;
        }

        // Both API calls have completed, set the loader to false
        this.isLoading = false;
      },
      () => {
        // Handle errors for both API calls
        this.alertService.error('Unable to load data.');
        this.isLoading = false; // Set the loader to false even if there's an error
      }
    );
  }
  loadLeadComments() {
    this.leadService.list(this.id).then(
      (response: any) => {
        this.leadComments = response;
      },
      () => {
        this.alertService.error(
          'Unable to load the questionnaire submission comment.'
        );
      }
    );
  }

  save() {
    if (this.leadNotesFile != null) {
      this.savelnfile();
      this.leadNotesFile = null;
      this.leadNotesFilelink = '';
    } else {
      this.saveComment();
    }
  }

  saveComment() {
    if (!this.leadCommentForm.valid) {
      this.alertService.error('Please enter note.');
      return;
    }
    var formData = this.leadCommentForm.value;
    console.log(formData);
    this.leadService
      .addLeadComment({ ...formData, questionnaireSubmissionId: this.id })
      .then(
        () => {
          this.alertService.success('Notes saved successfully.');
          // this.loadQuestionnaireSubmission();
          if (this.isUserSelectedForNotes) {
            this.sendEmail(
              this.selectedUser,
              this.leadCommentForm.value.comment
            );
            this.isUserSelectedForNotes = false;
          }
          this.loadLeadComments();
          this.leadCommentForm.reset();
        },
        () => {
          this.alertService.error('Unable to add notes.');
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
    if (this.leadNotesFile) {
      const mForm = new FormData();
      mForm.append('leadNotesFile', this.leadNotesFile);
      console.log(mForm);
      this.leadService.saveLeadNotesFile(this.id, mForm).then(
        () => {
          this.alertService.success('File saved successfully.');
          this.loadLeadComments();
          this.leadCommentForm.reset();
        },
        () => {
          this.alertService.error('Unable to save file.');
        }
      );
    }
  }

  loadTasks() {
    this.leadService.getLeadTask(this.id).then(
      (response: any) => {
        console.log(response.taskDTOList);
        this.leadTasks = response.taskDTOList;
        // console.log(this.leadTasks[0]);
      },
      () => {
        console.warn('Unable to load the tasks.');
      }
    );
  }

  addTaskTemplateModal() {
    this.showTaskTemplateModal = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTaskTemplateModal(e: any) {
    this.showTaskTemplateModal = false;
    this.loadTasks();
  }

  editTask(id: any) {
    this.router.navigate(['/tasks', id, 'edit'], {
      queryParams: { from: 'task' }
    });
  }

  getInitials(name: string) {
    // Split the name into an array of words
    const words = name.toLowerCase().split(' ');

    // Filter out any empty strings
    const filteredWords = words.filter((word) => word !== '');

    // Take the first character of each word and join them together
    const initials = filteredWords.map((word) => word[0]).join('');

    return initials.toUpperCase();
  }

  onKeydown(e: any) {
    if (!e.shiftKey) {
      e.preventDefault();
    }
    if (this.leadCommentForm.valid) {
      this.saveComment();
    }
  }

  filterList(query: string): UserData[] {
    return this.predefinedList.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
  }
  commentChange(e: any) {
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
      leadId: this.id,
      userId: user.id,
      message: message
    });
    // mForm.append('leadId', this.id);
    // mForm.append('userId', user.id);
    console.log(this.leadCommentEmailForm.value);
    var formData = this.leadCommentEmailForm.value;
    this.leadService.sendLeadCommentEmail(formData).then(
      () => {
        this.alertService.success('Email Send successfully.');
      },
      () => {
        this.alertService.error('Unable to send Email.');
      }
    );

    // var formData = this.leadCommentForm.value;
    // console.log(formData);
    // this.leadService
    //   .sendLeadCommentEmail({ ...formData, questionnaireSubmissionId: this.id })
    //   .then(
    //     () => {
    //       this.alertService.success('Notes saved successfully.');
    //       // this.loadQuestionnaireSubmission();
    //       this.loadLeadComments();
    //       this.leadCommentForm.reset();
    //     },
    //     () => {
    //       this.alertService.error('Unable to add notes.');
    //     }
    //   );
  }

  changeheight(e: any) {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }

  fileChangeEvent(e: any) {
    if (!e?.target || e.target.files?.length <= 0) {
      return;
    }
    if (this.fileTypes.includes(e.target.files[0]?.type)) {
      this.leadNotesFile = e.target.files[0];
      console.log(this.leadNotesFile);
    } else {
      this.alertService.error(
        'Only Image, Pdf, Word Doc, and PPT are supported.'
      );
    }
  }

  deletelnFile() {
    this.leadNotesFile = undefined;
    this.leadNotesFilelink = '';
  }
}
