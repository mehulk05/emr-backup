import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormatTimeService } from '../../services/time-utils/formatTime.service';
import { ToasTMessageService } from '../../services/toast-message.service';
import moment from 'moment';
import { PatientService } from 'src/app/modules/pateint/services/patient.service';
import { debounce } from 'lodash';

@Component({
  selector: 'app-patient-info-card',
  templateUrl: './patient-info-card.component.html',
  styleUrls: ['./patient-info-card.component.css']
})
export class PatientInfoCardComponent implements OnInit, OnChanges {
  @Input() patientId: any;
  leadComments: any[];
  leadCommentForm: FormGroup;
  isPatientDeleted: boolean = false;
  patientData: any;
  patientStatus = 'NEW';

  constructor(
    private router: Router,
    public formatTimeService: FormatTimeService,
    private alertService: ToasTMessageService,
    public formBuilder: FormBuilder,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    if (this.patientId) {
      this.init();
    }
  }

  ngOnChanges(): void {
    if (this.patientId) {
      this.isPatientDeleted = false;
      this.init();
      this.leadCommentForm = this.formBuilder.group({
        comment: ['', [Validators.required]],
        patientId: [this.patientId, []]
      });
    }
  }

  init() {
    this.loadPatientInfo();
    this.loadPatientComments();
  }

  loadPatientInfo() {
    this.patientService.getPatientOptimized(this.patientId).then(
      (response) => {
        this.patientData = response;
        this.patientStatus = this.patientData.patientStatus;
      },
      (error: any) => {
        if (error?.status === 404) {
          this.isPatientDeleted = true;
        }
      }
    );
  }

  formatDate(date: any) {
    if (date) {
      const adjustedDate = moment.utc(date).utcOffset(0).format('MM-DD-YYYY');
      return moment(adjustedDate).format('MM-DD-YYYY');
    }
    return date;
  }

  loadPatientComments() {
    this.patientService.patientCommentList(this.patientId).then(
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
      () => {
        this.alertService.error('Unable to load the comments.');
      }
    );
  }

  isDaySame(date1: string, date2: string) {
    return moment(moment(date1).format('yyyy-MM-DD')).isSame(
      moment(moment(date2).format('yyyy-MM-DD'))
    );
  }

  editPatient() {
    this.router.navigate(['/patients/' + this.patientId + '/edit'], {
      queryParams: { source: 'pateint' }
    });
  }

  getTextAnswerValue(answer: any) {
    return answer ? answer.replace(/\n/g, '<br/>') : '';
  }

  saveComment() {
    if (!this.leadCommentForm.valid) {
      this.alertService.error('Please enter note.');
      return;
    }
    var formData = this.leadCommentForm.value;
    this.patientService.addPaitentComment(formData).then(
      () => {
        this.alertService.success('Notes saved successfully.');
        this.loadPatientInfo();
        this.loadPatientComments();
        this.leadCommentForm.reset();
        this.leadCommentForm.patchValue({
          patientId: this.patientId
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
