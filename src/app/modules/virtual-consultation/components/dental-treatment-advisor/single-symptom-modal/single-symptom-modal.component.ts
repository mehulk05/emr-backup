import { Component, Input, OnInit } from '@angular/core';
import { VirtualConsulationService } from '../../../services/virtual-consulation.service';

@Component({
  selector: 'app-single-symptom-modal',
  templateUrl: './single-symptom-modal.component.html',
  styleUrls: ['./single-symptom-modal.component.css']
})
export class SingleSymptomModalComponent implements OnInit {
  @Input() serviceList: any = [];
  selectedSymptomService: any = [];
  selectedSymptomObj: any;
  selectedServiceIds: any = [];
  editMode: boolean = false;
  filteredSymtom: any;
  vcServiceId: any;
  symptomServiceList: any = [];
  @Input() set selectedSymptom(item: any) {
    console.log(item);
    this.selectedSymptomObj = item;
    this.loadServiceForTeeth();
    this.loadServiceBySymptomName();
  }
  constructor(private dentalVc: VirtualConsulationService) {}
  ngOnInit(): void {
    // this.loadServiceForTeeth();
    console.log('here');
  }

  loadServiceForTeeth() {
    this.dentalVc
      .getOptimozedServicesByBodyPart('teeth', 'female')
      .then((data: any) => {
        this.vcServiceId = data?.id;
        const filteredSymptoms = data?.symptoms
          .filter(
            (entry: any) => entry.symptom.name === this.selectedSymptomObj.title
          )
          .map((entry: any) => entry.symptom);
        console.log(filteredSymptoms);
        this.selectedServiceIds = filteredSymptoms[0]?.symptmServices?.map(
          (symptom: any) => symptom?.service?.id
        );
        console.log(this.selectedServiceIds);
        this.selectedSymptomService = filteredSymptoms[0]?.symptmServices;
        this.filteredSymtom = filteredSymptoms[0];
        console.log(this.filteredSymtom);
      });
  }

  loadServiceBySymptomName() {
    this.dentalVc
      .getSymptomByBodyPartAndSymptomName(
        'teeth',
        'female',
        this.selectedSymptomObj?.title
      )
      .then((data: any) => {
        console.log(data);
        // this.symptomServiceList = data;
        // this.selectedServiceIds = data?.map((symptom: any) => symptom.id);
      });
  }

  editSymptom() {
    this.editMode = true;
  }

  updateSymptom() {
    this.editMode = false;

    if (this.filteredSymtom?.id) {
      const data = {
        id: this.filteredSymtom?.id,
        name: this.filteredSymtom?.name,
        value: this.filteredSymtom?.name,
        serviceIds: this.selectedServiceIds,
        bodyPart: 'teeth'
      };
      this.dentalVc.updateSymptom(data.id, data).then(() => {
        // const newData = {
        //   type: 'virtual',
        //   gender: 'female',
        //   bodyPart: 'teeth',
        //   symptomsIds: [response.id]
        //   //serviceIds: this.services3
        // };
        // this.addUpdateVcConsultationService(newData);
        this.loadServiceForTeeth();
      });
    } else {
      const data = {
        name: this.selectedSymptomObj.title,
        value: this.selectedSymptomObj.title,
        serviceIds: this.selectedServiceIds,
        bodyPart: 'teeth',
        gender: 'female'
      };
      this.dentalVc.addSymptom(data).then((response: any) => {
        const newData = {
          type: 'virtual',
          gender: 'female',
          bodyPart: 'teeth',
          symptomsIds: [response.id]
          //serviceIds: this.services3
        };
        this.addUpdateVcConsultationService(newData);
      });
    }
  }

  addUpdateVcConsultationService(data: any) {
    if (this.vcServiceId) {
      this.dentalVc.updateOptimizedVCService(this.vcServiceId, data).then(
        (response: any) => {
          this.vcServiceId = response.id;
          this.loadServiceForTeeth();
        },
        () => {
          // this.toastService.error('Unable to update consultation.');
        }
      );
    } else {
      this.dentalVc.createVCService(data).then(
        (response: any) => {
          this.vcServiceId = response.id;
          this.loadServiceForTeeth();
        },
        () => {
          // this.toastService.error('Unable to create consultation.');
        }
      );
    }
  }

  cancelEdit() {
    this.editMode = false;
  }
}
