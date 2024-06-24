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
@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.css']
})
export class CreateTaskModalComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() modalData: any;
  @Input() modalMessage: any;
  @Output() modalClosed = new EventEmitter<any>();
  @ViewChild('modal') modal: any;

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

  constructor(
    public formBuilder: FormBuilder,
    private alertService: ToasTMessageService,
    public userService: UserService,
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((data: any) => {
      this.id = data.params.leadId;
    });
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', []],
      priority: ['', [Validators.required]],
      workflowTaskStatus: ['Todo', [Validators.required]],
      workflowTaskUser: ['', [Validators.required]],
      deadline: ['', []],
      questionnaireSubmissionId: [this.id, []]
    });

    this.currentTime = new Date();
    this.currentTime.setHours(0, 0, 0, 0);
    this.loadUsers();
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

  hideModal() {
    this.modalClosed.emit({ close: true, isCreate: false });
    this.showModal = false;
  }

  submitTaskForm() {
    if (this.taskForm.invalid) {
      return;
    }
    if (this.taskForm.value.deadline) {
      var deadline = this.taskForm.value.deadline;
      this.taskForm.value.deadline = new Date(
        deadline.setDate(deadline.getDate() + 1)
      );
    }
    var formData = this.taskForm.value;
    formData.questionnaireSubmissionId = this.id;
    this.taskService.createTask(formData).then(
      () => {
        this.alertService.success('Task Created Successfully');
        this.showModal = false;
        this.taskForm.reset();
        this.modalClosed.emit({ close: true, isCreate: true });
      },
      () => {
        this.alertService.error('Unable to Create Task');
        this.showModal = false;
      }
    );
  }

  onDateSelect(e: any) {
    console.log(e.value);
  }
}
