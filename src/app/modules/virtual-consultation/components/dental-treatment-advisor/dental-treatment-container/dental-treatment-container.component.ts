import { Component, OnInit } from '@angular/core';
import { VirtualConsulationService } from '../../../services/virtual-consulation.service';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-dental-treatment-container',
  templateUrl: './dental-treatment-container.component.html',
  styleUrls: ['./dental-treatment-container.component.css']
})
export class DentalTreatmentContainerComponent implements OnInit {
  symptomSelectorLink = environment.NEW_UI_DOMAIN;

  symptomSelectorIframe =
    '<iframe style="height:700px;width:1200px;border:0" src="https://devemr.growthemr.com/assets/static/composer.html?bid=1686&fid=10616" title="Contact Form"></iframe>';

  selectedItem: any;
  isLoading: boolean;
  modalItems = modalItems;
  showSingleSymptomModal: boolean = false;
  showDentalService: boolean = false;
  servicesList: any = [];
  showEditDesriptionModal: boolean = false;
  dentalVcInstructions: string =
    'Please follow these steps to receive confidential treatment recommendations:\n' +
    '1. Place the Cursor on the desired Body Part (Toggle for front/back).\n' +
    '2. Select the symptoms which best describe your condition.\n' +
    '3. You can select multiple body parts and related symptoms.';
  newDentalVcInstructions: string =
    'To receive personalized treatment recommendations in confidence, please follow these simple steps:\n' +
    '1. Click over the relevant area on the dental model.\n' +
    '2. Choose the symptoms that best match your concern.\n' +
    '3. You can select multiple symptoms.';
  loggedInUser: any;
  symptomsAndServices: any;
  modalId: any;
  showAddServiceModal: boolean = false;
  constructor(
    private dentalVc: VirtualConsulationService,
    private localStorageService: LocalStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    this.selectedItem = this.modalItems[0];
    console.log(this.selectedItem);
    this.loggedInUser = this.localStorageService.readStorage('currentUser');

    const questionnaire: any = await this.dentalVc.getLeadCaptureFormId();

    this.loadAllService();
    this.getSaveModelData();
    this.symptomSelectorLink +=
      '/assets/static/composer.html?bid=' +
      this.loggedInUser?.businessId +
      '&fid=' +
      questionnaire?.id +
      '&dental=true';

    console.log(this.symptomSelectorLink);
    this.loadServiceForTeeth();
  }

  loadAllService() {
    this.dentalVc.getAllServices().then((data: any) => {
      this.servicesList = data?.serviceList;
    });
  }

  onItemSelect(item: any) {
    this.selectedItem = item;
  }

  onShowDentalService() {
    this.showDentalService = true;
  }

  loadServiceForTeeth() {
    this.dentalVc
      .getOptimozedServicesByBodyPart('teeth', 'female')
      .then((data: any) => {
        this.symptomsAndServices = data?.symptoms;
        // this.modalId = data.id;
      });
  }

  onSelectedSymtpomClick() {
    console.log('here');
    this.showSingleSymptomModal = true;
  }

  updateDentalInstructions() {
    this.showEditDesriptionModal = false;
    this.dentalVc
      .updateDentalVCDescription(this.modalId, this.dentalVcInstructions)
      .then(() => {
        console.log('here');
      });
  }

  getSaveModelData = () => {
    this.dentalVc.getSymptomModel().then(
      (response: any) => {
        if (response['length'] > 0) {
          const modelData = response[0];
          this.modalId = modelData.id;
          if (modelData.dentalDescription) {
            if (modelData.dentalDescription === this.dentalVcInstructions) {
              this.dentalVcInstructions = this.newDentalVcInstructions;
            } else {
              this.dentalVcInstructions = modelData.dentalDescription;
              // this.genderToHide = modelData.genderToHide;
            }
          } else {
            this.dentalVcInstructions = this.newDentalVcInstructions;
          }
        }
      },
      () => {
        // this.toastService.error('Unable to load Saved Model.');
      }
    );
  };

  addNewService() {
    this.showAddServiceModal = true;
  }
}

export const modalItems = [
  {
    img: 'https://g99plus.b-cdn.net/AEMR/assets/dental-modal/Layer_1.png',
    title: 'Gummy Smile'
  },
  {
    img: 'https://g99plus.b-cdn.net/AEMR/assets/dental-modal/Layer_1%20(1).png',
    title: 'Size Discrepancy'
  },
  {
    img: 'https://g99plus.b-cdn.net/AEMR/assets/dental-modal/Layer_1%20(2).png',
    title: 'Narrow Smile'
  },
  {
    img: 'https://g99plus.b-cdn.net/AEMR/assets/dental-modal/Layer_1%20(3).png',
    title: 'Worn Down Teeth'
  },
  {
    img: 'https://g99plus.b-cdn.net/AEMR/assets/dental-modal/Layer_1%20(4).png',
    title: 'Crooked Teeth'
  },
  {
    img: 'https://g99plus.b-cdn.net/AEMR/assets/dental-modal/Layer_1%20(5).png',
    title: 'Gap or Spaces'
  },
  {
    img: 'https://g99plus.b-cdn.net/AEMR/assets/dental-modal/Layer_1%20(6).png',
    title: 'Oversized Teeth'
  },
  {
    img: 'https://g99plus.b-cdn.net/AEMR/assets/dental-modal/Layer_1%20(7).png',
    title: 'Chipped or Broken Teeth'
  },
  {
    img: 'https://g99plus.b-cdn.net/AEMR/assets/dental-modal/Layer_1%20(8).png',
    title: 'Small Teeth'
  }
];
