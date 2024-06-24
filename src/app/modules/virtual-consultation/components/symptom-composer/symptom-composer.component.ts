import { Component, OnInit } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { VirtualConsulationService } from '../../services/virtual-consulation.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-symptom-composer',
  templateUrl: './symptom-composer.component.html',
  styleUrls: ['./symptom-composer.component.css']
})
export class SymptomComposerComponent implements OnInit {
  editDetailObj = {
    isEditTitle: false,
    isEditDesc: false,
    isLoading: false
  };
  symptomModalDetail: any = {
    title: '',
    description: '',
    maleDescription: ''
  };
  selectedGender = 'female';
  selectedSide = 'front';
  femaleFront = true;
  femaleBack = false;
  selectedMaleModel: any = 1;
  selectedFemaleModel: any = 10;
  maleFront = '';
  maleBack = '';
  symptomModelId: any;
  showServiceModal: boolean = false;
  showMaleModelFirst: boolean;
  hideSelectedSymptoms: boolean;
  genderToHide: any = 'none';
  showDentalComponent: boolean = false;
  constructor(
    private virtualService: VirtualConsulationService,
    private toastService: ToasTMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data) => {
      console.log(data);
      if (data && data?.dental) {
        this.showDentalComponent = true;
      } else {
        this.getSaveModelData();
        this.showDentalComponent = false;
      }
    });
  }

  toggleModalView(e: any) {
    console.log(e, this.selectedFemaleModel, this.selectedMaleModel);
    if (e && e.checked) {
      this.selectedSide = 'back';
    } else {
      this.selectedSide = 'front';
    }
  }

  onModalChange(e: any) {
    console.log(e);
    if (this.selectedGender == 'female') {
      this.selectedFemaleModel = e;
    } else {
      this.selectedMaleModel = e;
    }
  }

  onGenderChange(e: any) {
    console.log(e);
    this.selectedGender = e;
  }

  onvcConfigChange(e: any) {
    this.genderToHide = e.genderToHide;
    this.showMaleModelFirst = e.showMaleModelFirst;
    console.log(this.showMaleModelFirst);

    Promise.all([
      this.virtualService.genderToHide(this.symptomModelId, e.genderToHide),
      this.virtualService.showMaleModalFirst(
        this.symptomModelId,
        this.showMaleModelFirst
      )
    ]).then(() => {
      this.toastService.success(
        'Configuration for the model has been updated successfully!'
      );
    });
  }

  onhideSelectedSymptoms(e: any) {
    this.hideSelectedSymptoms = e.hideSelectedSymptoms;
    console.log(this.hideSelectedSymptoms);
    Promise.all([
      this.virtualService.hideSelectedSymptoms(
        this.symptomModelId,
        this.hideSelectedSymptoms
      )
    ]).then(() => {
      if (this.hideSelectedSymptoms) {
        this.toastService.success(
          'Selected Symptoms will be hidden on the preview page.'
        );
      } else {
        this.toastService.success(
          'Selected Symptoms will be visible on the preview page.'
        );
      }
    });
  }

  // showAllServiceModal() {
  //   this.showServiceModal = true;
  //   // this.refreshPage(); // Call the refreshPage method when hiding the modal
  // }
  // Component code
  showAllServiceModal() {
    console.log('Opening service modal...');
    this.loadSymptomData();
  }

  loadSymptomData() {
    console.log('Loading symptom data...');
    this.refreshPage();
  }

  refreshPage() {
    console.log('Refreshing page...');
    // Reload the current route
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const currentUrl = this.router.url + '?';
    this.router.navigateByUrl(currentUrl).then(() => {
      // After the route is navigated, set showServiceModal to true
      this.showServiceModal = true;
    });
  }

  getSaveModelData = () => {
    this.virtualService.getSymptomModel().then(
      (response: any) => {
        if (response['length'] > 0) {
          const modelData = response[0];
          this.selectedFemaleModel = modelData.femaleModelId;
          this.selectedMaleModel = modelData.maleModelId;
          this.symptomModelId = modelData.id;
          this.symptomModalDetail = modelData;
          this.genderToHide = modelData.genderToHide;
          this.showMaleModelFirst = modelData.showMaleModelFirst;
          this.hideSelectedSymptoms = modelData.hideSelectedSymptoms;
          console.log(this.genderToHide, modelData);
        }
      },
      () => {
        this.toastService.error('Unable to load Saved Model.');
      }
    );
  };

  saveModelData = () => {
    const data = {
      femaleModelId: this.selectedFemaleModel,
      maleModelId: this.selectedMaleModel
    };

    if (this.symptomModelId) {
      this.virtualService.updateSymtomModel(this.symptomModelId, data).then(
        () => {
          this.toastService.success('Symptom(s) and Model Selection Updated.');
        },
        () => {
          this.toastService.error('Unable to update Symptom Model Selection.');
        }
      );
    } else {
      this.virtualService.createSymptomModel(data).then(
        () => {
          this.toastService.success('Symptom Model Selection Saved.');
        },
        () => {
          this.toastService.error('Unable to Save Symptom Model Selection.');
        }
      );
    }
  };

  editTitle(feildName: string) {
    if (feildName == 'title') {
      this.editDetailObj.isEditTitle = true;
    } else {
      this.editDetailObj.isEditDesc = true;
    }
  }
  onHideServiceModal() {
    this.showServiceModal = false;
  }

  saveEdits(feildName: string) {
    this.editDetailObj.isLoading = true;
    /* ------------------------------- edit Title ------------------------------- */
    if (feildName == 'title') {
      this.virtualService
        .updateSymptomTitle(this.symptomModelId, this.symptomModalDetail.title)
        .then((response: any) => {
          this.editDetailObj.isLoading = false;
          this.editDetailObj.isEditTitle = false;
          if (response) {
            this.toastService.success('Symptom Title Updated.');
          } else {
          }
        });
    } else if (feildName === 'maleDescription') {
      console.log(this.symptomModalDetail);
      this.virtualService
        .updateMaleSymptomDescription(
          this.symptomModelId,
          this.symptomModalDetail.maleDescription
        )
        .then((response: any) => {
          this.editDetailObj.isEditDesc = false;
          this.editDetailObj.isLoading = false;
          if (response) {
            this.toastService.success('Symptom Description Updated.');
          } else {
          }
        });
    } else {
      /* ----------------------------- edit desciption ---------------------------- */

      this.virtualService
        .updateSymptomDescription(
          this.symptomModelId,
          this.symptomModalDetail.description
        )
        .then((response: any) => {
          this.editDetailObj.isEditDesc = false;
          this.editDetailObj.isLoading = false;
          if (response) {
            this.toastService.success('Symptom Description Updated.');
          } else {
          }
        });
    }
  }
}
