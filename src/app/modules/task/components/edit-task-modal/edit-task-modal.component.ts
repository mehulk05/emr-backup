import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { UserService } from 'src/app/modules/user/services/user.service';
import { TaskService } from 'src/app/modules/task/services/task.service';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment-timezone';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.css']
})
export class EditTaskModalComponent implements OnInit {
  @Input() showEditTaskModal: boolean = false;
  @Input() modalData: any;
  @Input() modalMessage: any;
  @Output() modalClosed = new EventEmitter<any>();
  @ViewChild('pcalendar') pcalendar: any;
  taskForm: FormGroup;
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
  id: any = null;
  users: any = [];
  currentTime: Date;
  deadLine: Date;

  constructor(
    public formBuilder: FormBuilder,
    private alertService: ToasTMessageService,
    public userService: UserService,
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('id', this.modalData);
    this.id = this.modalData;
    // this.activatedRoute.paramMap.subscribe((data: any) => {
    //   this.id = data.params.leadId;
    // });
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', []],
      workflowTaskStatus: ['Todo', [Validators.required]],
      priority: ['', [Validators.required]],
      workflowTaskUser: ['', [Validators.required]],
      deadline: ['', []],
      workflowTaskPatient: ['', []],
      questionnaireSubmissionId: ['', []]
    });
    this.currentTime = new Date();
    this.currentTime.setHours(0, 0, 0, 0);
    this.loadTask();
  }

  loadTask() {
    this.taskService.getTask(this.id).then(
      (response: any) => {
        console.log('resload', response);
        this.taskForm.patchValue({
          name: response.name,
          description: response.description,
          workflowTaskStatus: response.status,
          priority: response.priority,
          workflowTaskUser: response.userId,
          questionnaireSubmissionId: response.leadId,
          workflowTaskPatient: response.patientId
        });

        if (response.deadLine != null) {
          this.deadLine = new Date(response.deadLine);
          this.taskForm.patchValue({
            deadline: new Date(response.deadLine)
          });
        }
      },
      () => {
        this.alertService.error('Unable to get the task.');
      }
    );
  }

  onLoad(args: any) {
    console.log('arg', args);
  }

  loadUsers() {
    this.userService.getAllUsersForDropDown().then((response) => {
      this.users = response;
    });
  }

  get f() {
    return this.taskForm.controls;
  }

  hideModal(isEdit: boolean) {
    if (isEdit) {
      this.modalClosed.emit({ close: true, isEdit: true });
    } else {
      this.modalClosed.emit({ close: true, isEdit: false });
    }

    this.showEditTaskModal = false;
  }

  onDateSelect(e: any) {
    console.log(e);
  }

  submitTaskForm() {
    if (this.taskForm.invalid) {
      return;
    }
    console.log('task', this.taskForm.value);
    console.log(this.taskForm.value);

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
    this.taskService
      .updateTask(this.id, this.taskForm.value)
      .then((response: any) => {
        console.log('res', response);
        this.alertService.success('Task updated successfully.');
        this.hideModal(true);
      })
      .catch((err) => {
        console.error(err);
        this.alertService.error('Unable to save the task.');
      });
  }
}
