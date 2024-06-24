import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { VirtualConsulationService } from '../../services/virtual-consulation.service';

@Component({
  selector: 'app-preview-symptoms',
  templateUrl: './preview-symptoms.component.html',
  styleUrls: ['./preview-symptoms.component.css']
})
export class PreviewSymptomsComponent implements OnInit {
  @Input() showServiceModal: any = false;
  @Output() hideServiceModal = new EventEmitter<any>();
  services: any = [];
  allVCSData: any = [];
  allSymptomsForm!: FormGroup | any;
  symptomsData!: FormArray;
  constructor(
    public fb: FormBuilder,
    private virtualService: VirtualConsulationService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.loadAllServicesForVC();
    this.loadAllService();
  }

  ngOnDestroy(): void {
    // Refresh the page when navigating away from the component
    window.location.reload();
  }

  loadAllService() {
    this.virtualService.getAllServices().then((response: any) => {
      if (response && response.serviceList.length > 0) {
        for (const key in response.serviceList) {
          this.services.push({
            name: response.serviceList[key].name,
            value: response.serviceList[key].id
          });
        }
      }
    });
  }

  loadAllServicesForVC() {
    this.virtualService.getOptimizedAllServicesForVC().then((response: any) => {
      var maleData = response.filter(function (data: any) {
        return data.gender == 'male';
      });
      var femaleData = response.filter(function (data: any) {
        return data.gender == 'female' && data.bodyPart !== 'teeth';
      });
      this.allVCSData = [
        { gender: 'Male', data: maleData },
        { gender: 'Female', data: femaleData }
      ];
      this.allSymptomsForm = this.fb.group({ allData: this.fb.array([]) });
      this.initFormControl();
    });
  }

  initFormControl() {
    const control = <any>this.allSymptomsForm.controls.allData;
    this.allVCSData.forEach((VirtualConsultations: any) => {
      control.push(this.loadConsultations(VirtualConsultations));
    });
  }

  loadConsultations(virtualConsultations: any) {
    const group = this.fb.group({
      gender: virtualConsultations.gender,
      consultationsArray: this.fb.array([])
    });
    const ctrl = group.controls.consultationsArray as FormArray;
    virtualConsultations.data.forEach((consultation: any) => {
      ctrl.push(this.loadSingleConsultation(consultation));
    });
    return group;
  }

  loadSingleConsultation(consultation: any) {
    // initialize consultation
    const group = this.fb.group({
      consultationServiceId: consultation.id,
      bodyPart: consultation.bodyPart,
      symptomsArray: this.fb.array([])
    });
    const ctrl = group.controls.symptomsArray as FormArray;
    consultation.symptoms.forEach((symptom: any) => {
      ctrl.push(this.loadSymptom(symptom));
    });
    return group;
  }

  loadSymptom(entry: any) {
    const serviceIds: any = [];
    let service = '';
    entry.symptom.symptmServices.forEach((symptomService: any) => {
      serviceIds.push(symptomService.service.id);
      service += symptomService.service.name + ',';
    });

    if (service.length > 0) {
      service = service.substring(0, service.length - 1);
    }

    // initialize symptom
    return this.fb.group({
      name: entry.symptom.name,
      disabled: true,
      id: entry.symptom.id,
      //serviceLink: entry.symptom.serviceLink,
      bodyPart: entry.symptom.bodyPart,
      serviceIds: [serviceIds, []],
      service: service
    });
  }

  serviceLinkChange(e: any, index: any, symptom: any) {
    symptom.value.disabled = false;
    // var arrayControl = this.allSymptomsForm.get('symptomsArray') as FormArray;
    // arrayControl.at(index).patchValue({
    //   serviceIds: e.value
    // });

    // arrayControl.at(index).value.isEdit = true;
  }
  getAllData(): FormArray {
    return <FormArray>this.allSymptomsForm.get('allData');
  }

  getConsultations(consultationIndex: number): FormArray {
    return this.getAllData()
      .at(consultationIndex)
      .get('consultationsArray') as FormArray;
  }

  getSymptoms(consultationIndex: number, symptomIndex: number): FormArray {
    return this.getConsultations(consultationIndex)
      .at(symptomIndex)
      .get('symptomsArray') as FormArray;
  }

  symptomNameChange = ($event: any, symptom: any) => {
    const name = $event.target.value;
    symptom.value.name = name;
  };

  editSymptom = (control: any) => {
    control.value.disabled = false;
  };

  cancelEdit = (control: any) => {
    control.value.disabled = true;
  };
  updateSymptom(vcIndex: number, consultationIndex: number, index: number) {
    const itemVal = this.getSymptoms(vcIndex, consultationIndex).at(index);
    const symptomId = itemVal.value.id;
    const data = {
      id: itemVal.value.id,
      name: itemVal.value.name,
      value: itemVal.value.name,
      serviceIds: itemVal.value.serviceIds,
      bodyPart: itemVal.value.bodyPart
    };

    this.virtualService.updateSymptom(symptomId, data).then(
      (response: any) => {
        this.toastService.success('Symptom Updated.');

        let service = '';
        response.symptmServices.forEach((symptomService: any) => {
          service += symptomService.service.name + ',';
        });
        if (service.length > 0) {
          service = service.substring(0, service.length - 1);
        }

        // Update the service field of the symptom object
        itemVal.patchValue({
          service: service
        });

        // Update the name field of the symptom object
        itemVal.patchValue({
          name: response.name
        });
      },
      () => {
        this.toastService.error('Unable to Update symptom.');
      }
    );
    itemVal.value.disabled = true;
  }

  // updateSymptom = (
  //   vcIndex: number,
  //   consultationIndex: number,
  //   index: number
  // ) => {
  //   const itemVal = this.getSymptoms(vcIndex, consultationIndex).at(index);
  //   const symptomId = itemVal.value.id;
  //   const data = {
  //     id: itemVal.value.id,
  //     name: itemVal.value.name,
  //     value: itemVal.value.name,
  //     serviceIds: itemVal.value.serviceIds,
  //     bodyPart: itemVal.value.bodyPart
  //   };
  //   this.virtualService.updateSymptom(symptomId, data).then(
  //     (response: any) => {
  //       this.toastService.success('Symptom Updated.');

  //       let service = '';
  //       response.symptmServices.forEach((symptomService: any) => {
  //         service += symptomService.service.name + ',';
  //       });
  //       if (service.length > 0) {
  //         service = service.substring(0, service.length - 1);
  //       }
  //       itemVal.value.service = service;
  //     },
  //     () => {
  //       this.toastService.error('Unable to Update symptom.');
  //     }
  //   );
  //   itemVal.value.disabled = true;
  //   console.log('In update Symptom');
  //   this.loadAllServicesForVC();
  //   this.loadAllService();
  // };

  removeSymptom(vcIndex: number, consultationIndex: number, index: number) {
    const vcService = this.getConsultations(vcIndex).at(consultationIndex);
    const symptom = this.getSymptoms(vcIndex, consultationIndex).at(index);
    this.virtualService
      .deleteVCServiceSymptom(
        vcService.value.consultationServiceId,
        symptom.value.id
      )
      .then(
        () => {
          this.toastService.success('Symptom Deleted.');
          this.getSymptoms(vcIndex, consultationIndex).removeAt(index);
        },
        () => {
          this.toastService.error('Unable to delete symptom.');
        }
      );
  }

  onhide(e: any) {
    console.log(true, e);
    this.showServiceModal = false;
    this.hideServiceModal.emit(true);
  }
}
