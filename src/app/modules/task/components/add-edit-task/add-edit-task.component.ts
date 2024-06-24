import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import moment from 'moment';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { filter } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { Location } from '@angular/common';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { LeadsService } from 'src/app/modules/leads/service/leads.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';

@Component({
  selector: 'app-add-edit-task',
  templateUrl: './add-edit-task.component.html',
  styleUrls: ['./add-edit-task.component.css']
})
export class AddEditTaskComponent implements OnInit {
  taskId: any = null;
  submitted = false;
  taskForm: FormGroup;
  leadForm: FormGroup;
  patientForm: FormGroup;
  entity: string[] = ['Lead', 'Patient'];
  taskPriority = [
    { name: 'High', code: 'High' },
    {
      name: 'Medium',
      code: 'Medium'
    },
    {
      name: 'Low',
      code: 'Low'
    }
  ];
  taskStatus = [
    { name: 'Completed', code: 'Completed' },
    {
      name: 'In Progress',
      code: 'Inprogress'
    },
    {
      name: 'To-do',
      code: 'Todo'
    }
  ];
  users: [];
  patients: [];
  leads: [];
  lead: any;
  patient: any;
  today: Date;
  fromPage: any;
  previousURL = '';
  leadId: number;
  leadNumber: number;
  patientId: number;
  source: string;
  isPatient: boolean = false;
  isLead: boolean = true;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private leadService: LeadsService,
    private taskService: TaskService,
    private location: Location,
    private formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', []],
      workflowTaskStatus: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      workflowTaskUser: ['', [Validators.required]],
      deadline: ['', []],
      workflowTaskPatient: ['', []],
      questionnaireSubmissionId: ['', []],
      leadOrPatient: ['', []]
    });
    this.taskForm.reset();
    this.taskForm.patchValue({
      workflowTaskStatus: 'Todo'
    });
    this.leadForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.mobile)]
      ],
      // message: ['', []],
      email: ['', [Validators.required, Validators.pattern(RegexEnum.email)]]
    });
    this.patientForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.mobile)]
      ],
      email: ['', [Validators.required, Validators.pattern(RegexEnum.email)]]
    });
    this.taskId = this.activatedRoute.snapshot.params.id;
    console.log('form', this.activatedRoute.snapshot.routeConfig.path);
    this.fromPage = this.activatedRoute.snapshot.routeConfig.path;
    console.log('form11', this.fromPage);
    if (this.taskId) {
      this.loadTask();
    }

    this.loadUsers();
    this.loadPatients();
    this.loadLead();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log('prev:', event.url);
        this.previousURL = event.url;
      });

    this.activatedRoute.queryParams.subscribe((params) => {
      //console.log(params);
      if (params.leadId) this.leadId = params.leadId;
      //console.log(this.leadId);
      if (params.source) this.source = params.source;
    });
  }

  loadTask() {
    this.taskService.getTask(this.taskId).then(
      (response: any) => {
        this.lead = response.leadDTO;
        this.patient = response.patientDTO;
        this.taskForm.patchValue({
          name: response.name,
          description: response.description,
          workflowTaskStatus: response.status,
          priority: response.priority,
          workflowTaskUser: response.userId,
          questionnaireSubmissionId: response.leadId,
          workflowTaskPatient: response.patientId,
          leadOrPatient: ''
        });

        if (this.lead) {
          this.taskForm.patchValue({
            leadOrPatient: 'Lead'
          });
          this.isLead = true;
          this.isPatient = false;
          this.loadLeadDetails(response.leadId);
        } else if (this.patient) {
          this.taskForm.patchValue({
            leadOrPatient: 'Patient'
          });
          this.isLead = false;
          this.isPatient = true;
        }

        if (this.isLead) {
          this.leadForm.patchValue({
            firstName: this.lead?.firstName,
            lastName: this.lead?.lastName,
            phoneNumber: this.lead?.phoneNumber,
            gender: this.lead?.gender,
            email: this.lead?.email
          });
        } else if (this.isPatient) {
          this.leadForm.patchValue({
            firstName: this.patient?.firstName,
            lastName: this.patient?.lastName,
            phoneNumber: this.patient?.phoneNumber,
            gender: this.patient?.gender,
            email: this.patient?.email
          });
        }

        this.leadNumber = this.lead?.id;
        this.patientId = response.patientId;
        if (response.deadLine != null) {
          const deadline = this.formatTimeService.compareApiDateWithLocalTime(
            response.deadLine
          );
          this.taskForm.patchValue({
            deadline: deadline
          });
        }
      },
      () => {
        this.alertService.error('Unable to get the task.');
      }
    );
  }

  loadUsers() {
    this.taskService.getOptmizedAllUsers().then((response: any) => {
      this.users = response;
    });
  }

  loadPatients() {
    this.taskService.getOptmizedAllPatients().then((response: any) => {
      this.patients = response;
    });
  }

  loadLead() {
    this.taskService.getOptmizedAllLeads().then((response: any) => {
      this.leads = response;
    });
  }

  onDateSelect(e: any) {
    const date = moment(e).utc();
    this.taskForm.patchValue({
      deadline: date
    });
  }

  get f() {
    return this.taskForm.controls;
  }

  get leadControls() {
    return this.leadForm.controls;
  }

  onChange(e: any) {
    this.onQstnTypeChange(e.target.value);
  }

  onQstnTypeChange(e: any) {
    console.log(e);
    if (e.value == 'Lead') {
      this.isLead = true;
      this.isPatient = false;
    } else {
      this.isLead = false;
      this.isPatient = true;
    }
  }

  submitForm = () => {
    this.submitted = true;

    if (this.taskForm.invalid) {
      return;
    }
    /* -------------------------------------------------------------------------- */
    /*                    BELOW LOGIC IS TO CONVERT DATE TO UTC                   */
    /* -------------------------------------------------------------------------- */

    // Reason why we need below is when a user comes the deadline from api response is in utc format.
    // Scenario one where user will not edit deadline date and hit save. The deadline will be in utc format.
    // scenario two where user selects a date from calendar which is local time zone
    // but when we convert that time to utc the date become selected date - 1 because we need to send date in utc format in api payload
    // To handle the above edge case we wrote below logic.
    const date = this.taskForm.value.deadline;
    console.log(date);
    if (date) {
      const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
      console.log(formattedDate, moment.utc(formattedDate).format());
      this.taskForm.value.deadline = moment.utc(formattedDate).format();
    }

    /* -------------------------------------------------------------------------- */
    /*                    ABOVE LOGIC IS TO CONVERT DATE TO UTC                   */
    /* -------------------------------------------------------------------------- */
    console.log(this.taskForm.value);
    const formData = this.taskForm.value;
    const leadData = this.leadForm.value;
    if (this.taskForm.value.leadOrPatient == 'Lead') {
      this.taskForm.value.workflowTaskPatient = null;
    } else if (this.taskForm.value.leadOrPatient == 'Patient') {
      this.taskForm.value.questionnaireSubmissionId = null;
    }

    if (this.taskId) {
      this.taskService.updateTask(this.taskId, formData).then(
        () => {
          console.log(leadData, 'leaddata');
          // if (this.lead && this.lead.id) {
          //   leadData.id = this.lead.id;
          //   this.taskService.updateLead(this.lead.id, leadData).then(() => {
          //     this.alertService.success('Updated successfully.');
          //     this.backOnSave();
          //   });
          // } else {
          this.alertService.success('Task updated successfully.');
          this.backOnSave();
          // }
        },
        () => {
          this.alertService.error('Unable to save the task.');
        }
      );
    } else {
      console.log(formData);
      this.taskService.createTask(formData).then(
        () => {
          this.alertService.success('Task Created Successfully');
          this.backOnSave();
        },
        () => {
          this.alertService.error('Unable to Create Task');
        }
      );
    }
  };

  back = () => {
    // if (this.source && this.source === 'leadTask')
    //   this.router.navigate(['/leads/' + this.leadId], {
    //     queryParams: { currentTab: 'leadTask' }
    //   });
    // else
    this.location.back();
  };

  goToDetail() {
    this?.lead ? this.goToLeadDetail() : this.goToPatientDetail();
  }

  goToLeadDetail = () => {
    this.router.navigate(['/leads/' + this.leadNumber + '/edit'], {
      queryParams: { source: 'leadDetail' }
    });
  };

  goToPatientDetail = () => {
    this.router.navigate(['/patients/' + this.patientId + '/edit'], {
      queryParams: { source: 'pateint' }
    });
  };

  backOnSave() {
    console.log('frompage', this.fromPage);
    if (this.fromPage == 'create') {
      this.router.navigate(['/tasks'], {
        state: { isDataModified: true }
      });
    } else {
      this.location.back();
    }
  }

  loadLeadDetails(leadId: any) {
    this.leadService.getQuestionnaireSubmission(leadId).then(
      (response: any) => {
        this.lead = {};
        this.lead.id = response.id;
        this.lead.source = response.source;
        this.lead.landingPageName = response.landingPageName;
        this.lead.createdDate = response.createdAt;
        this.lead.questionnaireSubmission = response;
        this.lead.lead_status = response.leadStatus;
        for (let i = 0; i < response.questionAnswers.length; i++) {
          if (
            response.questionAnswers[i].questionName.toLowerCase() ==
            'first name'
          ) {
            this.lead.firstName = response.questionAnswers[i].answerText;
          } else if (
            response.questionAnswers[i].questionName.toLowerCase() ==
            'last name'
          ) {
            this.lead.lastName = response.questionAnswers[i].answerText;
          } else if (
            response.questionAnswers[i].questionName.toLowerCase() == 'email'
          ) {
            this.lead.email = response.questionAnswers[i].answerText;
          } else if (
            response.questionAnswers[i].questionName.toLowerCase() ==
            'phone number'
          ) {
            this.lead.phoneNumber = response.questionAnswers[i].answerText;
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
