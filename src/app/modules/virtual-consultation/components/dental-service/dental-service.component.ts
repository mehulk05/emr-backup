import { Component, Input } from '@angular/core';
import { VirtualConsulationService } from '../../services/virtual-consulation.service';

@Component({
  selector: 'app-dental-service',
  templateUrl: './dental-service.component.html',
  styleUrls: ['./dental-service.component.css']
})
export class DentalServiceComponent {
  @Input() services: any = [];
  selectedServiceList: any = [];
  selectedSymptom: any;
  selectedServiceObjId: any;
  @Input() serviceList: any = [];
  constructor(private dentalVc: VirtualConsulationService) {}

  loadAllService() {
    this.dentalVc.getAllServices().then((data: any) => {
      this.serviceList = data?.serviceList;
    });
  }
  loadServiceForTeeth() {
    this.dentalVc
      .getOptimozedServicesByBodyPart('teeth', 'female')
      .then((data: any) => {
        this.services = data?.symptoms;
      });
  }

  editSymptom(serviceObj: any) {
    this.selectedServiceList = serviceObj.symptom.symptmServices.map(
      (data: any) => data.service.id
    );
    this.selectedServiceObjId = serviceObj.id;
  }

  updateSymptom(index: any, service: any) {
    console.log(index);
    const data = {
      id: service.symptom.id,
      name: service.symptom.name,
      value: service.symptom.name,
      serviceIds: this.selectedServiceList,
      bodyPart: 'teeth'
    };

    this.dentalVc.updateSymptom(data.id, data).then(() => {
      this.loadServiceForTeeth();
      this.selectedServiceList = [];
      this.selectedServiceObjId = null;
    });
    this.loadServiceForTeeth();
  }

  cancelEdit() {
    this.selectedServiceList = [];
    this.selectedServiceObjId = [];
  }
}
