import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AppointmentService } from '../../../services/appointment.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
})
export class AddServiceComponent implements OnChanges {
  @Input() showModal: any;
  @Input() appointment: any;
  @Output() modalClosed = new EventEmitter<any>();
  showServicesSelection: boolean;
  providerServices: any = [];
  tempServices: any = [];
  count: any;
  selectedTempService: any = [];
  showError = false;
  constructor(
    private alertService: ToasTMessageService,
    private appointmentService: AppointmentService
  ) {}

  ngOnChanges(): void {
    if (this.appointment) {
      console.log(this.appointment);
      this.getProviderServices();
    }
  }

  getProviderServices() {
    const services: { id: any; name: any }[] = [];
    this.appointment.services.map((data: any) => {
      services.push({
        id: data.service.id,
        name: data.service.name
      });
    });
    this.appointmentService
      .getProviderServicesOptimised(
        this.appointment.clinic?.id,
        this.appointment.provider?.id
      )
      .then(
        (response: any) => {
          console.log(services);
          this.providerServices = response;
          this.showServicesSelection = true;
          if (services && services.length > 0) {
            const myArrayFiltered = response.filter((el: any) => {
              return services.some((f: any) => {
                return f.id !== el.id;
              });
            });
            this.tempServices = myArrayFiltered;
          } else {
            this.tempServices = response;
          }

          // console.log(myArrayFiltered, this.providerServices, services);
        },
        () => {
          this.alertService.error('Unable to load the provider services.');
        }
      );
  }

  hideModal(e?: any) {
    console.log(e);
    this.modalClosed.emit({ from: 'addService', refreshPage: false });
    this.showModal = false;
  }

  addService() {
    console.log('');
    const result = this.selectedTempService.map((id: any) => id.id);
    console.log(result);
    this.appointmentService.addServices(this.appointment.id, result).then(
      () => {
        this.alertService.success('Service added successfully.');
        this.showServicesSelection = false;
        this.modalClosed.emit({ from: 'addService', refreshPage: true });
        this.showModal = false;
      },
      () => {
        this.alertService.error('Unable to add services to appointment.');
      }
    );
  }

  disableService(serviceId: any) {
    for (var i = 0; i < this.appointment.services.length; i++) {
      if (this.appointment.services[i].service.id == serviceId) {
        return true;
      }
    }
    return false;
  }

  selectServices(service: any, serviceId: any, flag: any) {
    if (flag == 'add') {
      var index = this.tempServices
        .map((item: any) => item.id)
        .indexOf(serviceId);
      if (index !== -1) {
        const data = this.tempServices.splice(index, 1);
        console.log(this.tempServices.length);
        this.selectedTempService.push(data[0]);
        this.count++;
      }
    } else {
      var index = this.selectedTempService
        .map((item: any) => item.id)
        .indexOf(serviceId);
      console.log(index);
      if (index !== -1) {
        const data = this.selectedTempService.splice(index, 1);

        this.count--;
        this.tempServices.push(data[0]);
      }
    }
    console.log(service, serviceId);
    // var index = this.tempServices.indexOf(serviceId);
  }
}
