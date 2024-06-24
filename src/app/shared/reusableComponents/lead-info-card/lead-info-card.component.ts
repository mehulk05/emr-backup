import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadsService } from 'src/app/modules/leads/service/leads.service';
import { FormatTimeService } from '../../services/time-utils/formatTime.service';
import { ToasTMessageService } from '../../services/toast-message.service';
import moment from 'moment';
import { debounce } from 'lodash';

@Component({
  selector: 'app-lead-info-card',
  templateUrl: './lead-info-card.component.html',
  styleUrls: ['./lead-info-card.component.css']
})
export class LeadInfoCardComponent implements OnInit, OnChanges {
  @Input() leadId: any;
  source: any;
  landingPageName: any;
  createdDate: any;
  questionnaireSubmission: any;
  leadStatus: any;
  isSourceVirtualConsultation: boolean;
  firstName: any;
  firstNamePlaceId: any;
  lastName: any;
  lastNamePlaceId: any;
  email: any;
  leadComments: any[];
  leadCommentForm: FormGroup;
  isLeadDeleted: boolean = false;
  constructor(
    private router: Router,
    private leadService: LeadsService,
    public formatTimeService: FormatTimeService,
    private alertService: ToasTMessageService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.leadId) {
      this.init();
    }
  }

  ngOnChanges(): void {
    if (this.leadId) {
      this.isLeadDeleted = false;
      this.init();
      this.leadCommentForm = this.formBuilder.group({
        comment: ['', [Validators.required]],
        questionnaireSubmissionId: [this.leadId, []]
      });
    }
  }

  init() {
    this.loadQuestionnaireSubmission();
    this.loadLeadComments();
  }

  loadQuestionnaireSubmission() {
    this.leadService.getQuestionnaireSubmission(this.leadId).then(
      (response: any) => {
        this.source = response.source;
        this.landingPageName = response.landingPageName;
        this.createdDate = response.createdAt;
        this.questionnaireSubmission = this.sortByQuestionNumber(response);
        this.leadStatus = response.leadStatus;
        if (this.source != null && this.source == 'Self Assessment') {
          this.isSourceVirtualConsultation = true;
        }
        for (let i = 0; i < response.questionAnswers.length; i++) {
          if (
            response.questionAnswers[i].questionName.toLowerCase() ===
            'first name'
          ) {
            this.firstName = response.questionAnswers[i].answerText;
            this.firstNamePlaceId = response.questionAnswers[i].answerText;
          } else if (
            response.questionAnswers[i].questionName.toLowerCase() ===
            'last name'
          ) {
            this.lastName = response.questionAnswers[i].answerText;
            this.lastNamePlaceId = response.questionAnswers[i].answerText;
          } else if (
            response.questionAnswers[i].questionName.toLowerCase() === 'email'
          ) {
            this.email = response.questionAnswers[i].answerText;
          }
        }
      },
      (error: any) => {
        if (error?.status === 404) {
          this.isLeadDeleted = true;
        }
      }
    );
  }

  loadLeadComments() {
    this.leadService.list(this.leadId).then(
      (response: any) => {
        if (response) {
          const comments = response;
          const tempCommments = [];
          for (let i = 0; i < comments.length; i++) {
            if (
              i == 0 ||
              !this.isDaySame(comments[i].createdAt, comments[i - 1].createdAt)
            ) {
              tempCommments.push({
                type: 'date',
                value: moment(comments[i].createdAt).format('DD MMM yyyy')
              });
            }
            tempCommments.push({ type: 'message', value: comments[i] });
          }
          this.leadComments = [...tempCommments];
        }
      },
      (error: any) => {
        if (error.status === 404) {
        } else {
          this.alertService.error(
            'Unable to load the questionnaire submission comment.'
          );
        }
      }
    );
  }

  isDaySame(date1: string, date2: string) {
    return moment(moment(date1).format('yyyy-MM-DD')).isSame(
      moment(moment(date2).format('yyyy-MM-DD'))
    );
  }

  sortByQuestionNumber(response: any) {
    response.questionAnswers = response.questionAnswers.sort(
      (a: any, b: any) => a.questionId - b.questionId
    );
    return response;
  }

  symptomsValue(answerText: any) {
    let answer = '';
    try {
      const obj = JSON.parse(answerText);
      let ans = '';
      for (const [key, value] of Object.entries(obj)) {
        ans = ans + key.toUpperCase() + ': ' + [].concat(value).join() + ';';
      }

      if (ans.length > 1) {
        ans = ans.substring(0, ans.length - 1);
      }

      answer = ans;
    } catch (e) {
      answer = answerText;
    }
    return answer === '' ? '-' : answer;
  }

  getBusinessHours(hours: string) {
    return hours.split(',').map((hour) => hour.split('-'));
  }

  getTextAnswerValue(answer: any) {
    return answer ? answer.replace(/\n/g, '<br/>') : '';
  }

  editLead() {
    this.router.navigate(['/leads/' + this.leadId + '/edit'], {
      queryParams: { source: 'leadDetail', email: this.email ?? '' }
    });
  }

  saveComment() {
    if (!this.leadCommentForm.valid) {
      this.alertService.error('Please enter note.');
      return;
    }
    var formData = this.leadCommentForm.value;
    this.leadService.addLeadComment(formData).then(
      () => {
        this.alertService.success('Notes saved successfully.');
        this.loadQuestionnaireSubmission();
        this.loadLeadComments();
        this.leadCommentForm.reset();
        this.leadCommentForm.patchValue({
          questionnaireSubmissionId: this.leadId
        });
      },
      () => {
        this.alertService.error('Unable to add notes.');
      }
    );
  }

  onKeydown(e: any) {
    if (!e.shiftKey) {
      e.preventDefault();
    }
    if (this.leadCommentForm.valid) {
      this.saveComment();
    }
  }

  commentChange(e: any) {
    debounce(this.changeheight, 500)(e);
  }

  changeheight(e: any) {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }
}
