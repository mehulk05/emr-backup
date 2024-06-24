import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../../services/patient.service';
import moment from 'moment';

@Component({
  selector: 'app-add-edit-patient-task',
  templateUrl: './add-edit-patient-task.component.html',
  styleUrls: ['./add-edit-patient-task.component.css']
})
export class AddEditPatientTaskComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Input() patientId: any;
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
    private patientService: PatientService,
    public formBuilder: FormBuilder,
    private alertService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', []],
      workflowTaskStatus: ['Todo', [Validators.required]],
      priority: ['', [Validators.required]],
      workflowTaskUser: ['', [Validators.required]],
      deadline: ['', []],
      questionnaireSubmissionId: [null, []],
      workflowTaskPatient: [this.patientId, []]
    });
    this.loadUsers();
  }

  loadUsers() {
    this.patientService.getOptmizedAllUsers().then((response: any) => {
      this.users = response;
    });
  }

  hideTaskModal() {
    console.log('showmodal', this.showModal);
    this.modalClosed.emit({ close: true, isSaved: false });
    this.showModal = false;
  }

  saveTask() {
    if (this.taskForm.value.deadline) {
      const deadline = this.taskForm.value.deadline;
      const formattedDate = moment(deadline).format('YYYY-MM-DD HH:mm:ss');
      console.log(formattedDate, moment.utc(formattedDate).format());
      this.taskForm.value.deadline = moment.utc(formattedDate).format();
    }
    const formData = this.taskForm.value;
    formData.workflowTaskPatient = this.patientId;
    console.log(formData);
    this.patientService.createTask(formData).then(
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
