import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { VirtualConsulationService } from '../../services/virtual-consulation.service';

@Component({
  selector: 'app-symptom-composer-form',
  templateUrl: './symptom-composer-form.component.html',
  styleUrls: ['./symptom-composer-form.component.css']
})
export class SymptomComposerFormComponent implements OnInit, OnChanges {
  @Input() modalData: any;
  symptomsArray: any;
  services: any = [];
  vcServiceId: any;
  symptomForm!: FormGroup;
  duplicateSymtom: boolean = false;
  disableAddButton: boolean = true;
  newSymptomIds: any = [];
  symptomName: any;
  private navigationSubscription: any;

  constructor(
    public fb: FormBuilder,
    private virtualService: VirtualConsulationService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.symptomForm = this.fb.group({
      serviceIds: [['']],
      symptoms: this.fb.array([]),
      newSymptomForm: this.createSnameFormGroup()
    });

    this.loadAllServices();
  }

  ngOnDestroy(): void {
    // Refresh the page when navigating away from the component
    window.location.reload();
  }

  disbaleFormControl() {
    this.symptomForm.controls['symptoms'].disable();
  }

  ngOnChanges(): void {
    this.disableAddButton = true;

    if (this.symptomForm) {
      this.symptomForm = this.fb.group({
        serviceIds: [['']],
        symptoms: this.fb.array([]),
        newSymptomForm: this.createSnameFormGroup()
      });
    }

    if (this.modalData && Object.keys(this.modalData).length > 0) {
      this.getServicesByBodyPart();
    }
  }

  loadAllServices() {
    this.virtualService.getAllServices().then((response: any) => {
      if (response.serviceList) {
        for (const key in response.serviceList) {
          this.services.push({
            name: response.serviceList[key].name,
            value: response.serviceList[key].id
          });
        }
      }
    });
  }
  getServicesByBodyPart() {
    this.virtualService
      .getOptimozedServicesByBodyPart(
        this.modalData.bodyPart,
        this.modalData.gender
      )
      .then((response: any) => {
        console.log(response);
        if (response && response?.symptoms) {
          this.vcServiceId = response.id;
          this.symptomsArray = response.symptoms;
          console.log('sym', this.symptoms.value);
          this.symptomForm = this.fb.group({
            serviceIds: [['']],
            symptoms: this.fb.array([]),
            newSymptomForm: this.createSnameFormGroup()
          });
          console.log(this.symptomsArray);
          for (var i = 0; i < this.symptomsArray.length; i++) {
            this.symptoms.push(this.loadSymptom(this.symptomsArray[i]));
          }
          console.log(this.symptoms.value);
        } else {
          this.symptomForm = this.fb.group({
            serviceIds: [['']],
            symptoms: this.fb.array([]),
            newSymptomForm: this.createSnameFormGroup()
          });
        }
      });
  }

  serviceLinkChange = ($event: any, index: number) => {
    console.log($event);
    // const selectedSymptom = this.symptoms.at(index);
    // selectedSymptom.value.serviceIds = $event.value;
    var arrayControl = this.symptomForm.get('symptoms') as FormArray;
    arrayControl.at(index).patchValue({
      serviceIds: $event.value
    });

    // const itemVal = this.symptoms.at(index);
    // itemVal.value.name = symptomName.trim();
    // console.log(itemVal.value, arrayControl.value);
    // this.symptoms.at(index);
    console.log(arrayControl.at(index).value.name, this.symptomName);
    arrayControl.at(index).value.isEdit = true;
    arrayControl.at(index).value.name =
      this.symptomName ?? arrayControl.at(index).value.name;
    console.log(arrayControl.value, this.symptomName);
    console.log('item selected', $event.value);
  };

  loadSymptom(vcSymptom: any) {
    console.log(vcSymptom);
    const serviceIds: any[] = [];
    let service = '';
    vcSymptom.symptom.symptmServices.forEach((symptomService: any) => {
      serviceIds.push(symptomService.service.id);
      service += symptomService.service.name + ',';
    });

    if (service.length > 0) {
      service = service.substring(0, service.length - 1);
    }
    //console.log(this.symptomForm.value);
    // initialize symptom
    return this.fb.group({
      name: vcSymptom.symptom.name,
      id: vcSymptom.symptom.id,
      bodyPart: vcSymptom.symptom.bodyPart,
      gender: vcSymptom.symptom.gender,
      serviceIds: [serviceIds],
      service: service
    });
  }
  createSnameFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      gender: new FormControl(''),
      serviceLink: new FormControl('', []),
      isEdit: new FormControl(false),
      serviceIds: new FormControl([], [])
    });
  }

  get symptoms() {
    // return this.symptomForm.get('symptoms') as any;
    return <FormArray>this.symptomForm.get('symptoms');
  }

  symptomNameChange = ($event: any, index: number) => {
    this.symptomName = $event.target.value;
    const name = $event.target.value;
    const itemVal = this.symptoms.at(index);
    itemVal.value.name = name.trim();
  };

  editSymptom = (index: number) => {
    console.log('here');
    const selectedSymptom = this.symptoms.at(index);
    selectedSymptom.value.isEdit = true;
  };

  cancelEdit(index: number) {
    this.getServicesByBodyPart();
    const selectedSymptom = this.symptoms.at(index);
    selectedSymptom.value.isEdit = false;
  }

  removeSymptom(i: any) {
    console.log('value for i:-' + i);
    if (this.symptoms.length > 0) {
      const val = this.symptoms.at(i);
      this.virtualService
        .deleteVCServiceSymptom(this.vcServiceId, val.value.id)
        .then(() => {
          this.toastService.success('Symptom Deleted.');
          this.symptoms.removeAt(i);
        });
    } else {
      this.symptoms.reset();
    }
  }

  updateSymptom = (index: number) => {
    console.log('In update symptom. Index value is :-' + index);
    const selectedSymptom = this.symptoms.at(index);
    selectedSymptom.value.isEdit = false;

    if (selectedSymptom.value.name === '') {
      this.toastService.error('Unable to save');
      this.getServicesByBodyPart();
      return;
    }
    const name = selectedSymptom.value.name;
    var symptomExist = this.symptoms.value.filter(function (symptom: any) {
      return symptom.name.trim() === name.trim();
    });

    if (symptomExist.length > 1) {
      this.toastService.warn('Symptom with this name already present.');
      this.getServicesByBodyPart();
      return;
    } else {
      const symptomId = selectedSymptom.value.id;
      const data = {
        id: selectedSymptom.value.id,
        name: selectedSymptom.value.name.trim(),
        value: selectedSymptom.value.name.trim(),
        bodyPart: selectedSymptom.value.bodyPart,
        gender: this.modalData.gender,
        serviceIds: selectedSymptom.value.serviceIds
      };
      this.symptomName = null;
      console.log('data', data);

      this.virtualService
        .updateSymptom(symptomId, data)
        .then((response: any) => {
          this.toastService.success('Symptom Updated.');

          let service = '';
          response.symptmServices.forEach((symptomService: any) => {
            service += symptomService.service.name + ',';
          });
          if (service.length > 0) {
            service = service.substring(0, service.length - 1);
          }
          selectedSymptom.value.service = service;
        });
    }
  };

  onSymptomAdd = ($event: any) => {
    const name = $event.target?.value;
    var symptomExist = this.symptoms.value.filter(function (symptom: any) {
      return symptom.name.trim() === name.trim();
    });
    if (symptomExist.length) this.duplicateSymtom = true;
    else this.duplicateSymtom = false;
    this.disableAddButton = name === '' || this.duplicateSymtom;
  };

  addSymptom() {
    const newSymptomForm = this.symptomForm.get('newSymptomForm') as FormGroup;
    var data = {
      name: newSymptomForm.value.name,
      value: newSymptomForm.value.name,
      bodyPart: this.modalData.bodyPart,
      gender: this.modalData.gender,
      serviceLink: '',
      serviceIds: newSymptomForm.value.serviceIds
    };

    this.virtualService.addSymptom(data).then(
      (response: any) => {
        this.newSymptomIds.push(response.id);
        this.toastService.success('Symptom Saved.');

        this.symptoms.push(this.loadSymptom({ symptom: response }));
        newSymptomForm.patchValue({
          name: '',
          serviceIds: []
        });

        // remove save button and move functoinality to add button
        this.onSubmit();
      },
      () => {
        this.toastService.error('Unable to save symptom.');
      }
    );

    this.disableAddButton = true;
  }
  onSubmit() {
    const data = {
      type: 'virtual',
      gender: this.modalData.gender,
      bodyPart: this.modalData.bodyPart,
      symptomsIds: this.newSymptomIds
      //serviceIds: this.services3
    };

    if (this.vcServiceId) {
      //update
      if (this.newSymptomIds.length > 0) {
        this.virtualService
          .updateOptimizedVCService(this.vcServiceId, data)
          .then(
            (response: any) => {
              this.vcServiceId = response.id;
              this.newSymptomIds = [];
            },
            () => {
              this.toastService.error('Unable to update consultation.');
            }
          );
      }
    } else {
      //create
      this.virtualService.createVCService(data).then(
        (response: any) => {
          this.vcServiceId = response.id;
          this.newSymptomIds = [];
        },
        () => {
          this.toastService.error('Unable to create consultation.');
        }
      );
    }
  }
}
