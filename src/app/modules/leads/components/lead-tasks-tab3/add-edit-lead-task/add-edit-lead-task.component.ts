import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LeadsService } from '../../../service/leads.service';

@Component({
  selector: 'app-add-edit-lead-task',
  templateUrl: './add-edit-lead-task.component.html',
  styleUrls: ['./add-edit-lead-task.component.css']
})
export class AddEditLeadTaskComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() leadId: any;
  @Output() modalClosed = new EventEmitter<any>();
  taskForm!: FormGroup;
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
  today: Date = new Date();
  constructor(
    private leadService: LeadsService,
    public formBuilder: FormBuilder,
    private alertService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', []],
      priority: ['', [Validators.required]],
      workflowTaskStatus: ['Todo', [Validators.required]],
      workflowTaskUser: ['', [Validators.required]],
      deadline: ['', []],
      questionnaireSubmissionId: [this.leadId, []]
    });
    this.loadUsers();
  }

  loadUsers() {
    this.leadService.getOptmizedAllUsers().then((response: any) => {
      this.users = response;
    });
  }

  hideTaskModal() {
    console.log('showmodal', this.showModal);
    this.modalClosed.emit({ close: true, isSaved: false });
    this.showModal = false;
  }

  saveTask() {
    const formData = this.taskForm.value;
    formData.questionnaireSubmissionId = this.leadId;
    console.log(formData);
    this.leadService.createTask(formData).then(
      () => {
        this.alertService.success('Task Created Successfully');
        //   this.back();
        this.modalClosed.emit({ close: true, isSaved: true });
        this.showModal = false;
        this.taskForm.reset();
      },
      () => {
        this.alertService.error('Unable to Create Task');
        this.showModal = false;
      }
    );
  }

  get f() {
    return this.taskForm.controls;
  }
}
