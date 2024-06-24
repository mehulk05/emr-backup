import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AppointmentService } from '../../../services/appointment.service';
@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.css']
})
export class EditServiceComponent implements OnInit {
  @Input() showModal: any;
  @Input() appointment: any;
  @Input() service: any;
  @Output() modalClosed = new EventEmitter<any>();
  appointmentServiceForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: ToasTMessageService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.appointmentServiceForm = this.formBuilder.group({
      serviceName: [this.service.name, [Validators.required]],
      serviceCost: [this.service.serviceCost, [Validators.required]],
      serviceId: [this.service.id, []],
      durationInMinutes: [this.service.durationInMinutes, [Validators.required]]
    });
  }

  get f() {
    return this.appointmentServiceForm.controls;
  }
  hideModal(e?: any) {
    console.log(e);
    this.modalClosed.emit({ from: 'editService', refreshPage: false });
    this.showModal = false;
  }

  editService() {
    if (this.appointmentServiceForm.invalid) {
      return;
    }
    console.log('');
    const formData = this.appointmentServiceForm.value;
    this.appointmentService
      .updateAppointmentService(this.appointment.id, formData)
      .then(
        () => {
          //this.images.push(event.target.result);
          this.alertService.success('Service updated successfully.');
          this.modalClosed.emit({ from: 'ediService', refreshPage: true });
          this.showModal = false;
        },
        () => {
          this.alertService.error('Unable to update service.');
        }
      );
    // const result = this.selectedTempService.map((id: any) => id.id);
    // console.log(result);
    // this.appointmentService.addServices(this.appointment.id, result).then(
    //   () => {
    //     this.showServicesSelection = false;
    //     this.modalClosed.emit({ from: 'addService', refreshPage: true });
    //     this.showModal = false;
    //   },
    //   () => {
    //     this.alertService.error('Unable to add services to appointment.');
    //   }
    // );
  }
}
