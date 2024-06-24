import { Component, Input, OnInit } from '@angular/core';
import { MALE_BODY_PARTS, FEMALE_BODY_PARTS } from '../../constants';

@Component({
  selector: 'app-symptom-modal',
  templateUrl: './symptom-modal.component.html',
  styleUrls: ['./symptom-modal.component.css']
})
export class SymptomModalComponent implements OnInit {
  @Input() selectedGender: any;
  @Input() selectedSide: any;
  @Input() selectedFemaleModel: any;
  @Input() selectedMaleModel: any;
  MALE_BODY = MALE_BODY_PARTS;
  FEMALE_BODY = FEMALE_BODY_PARTS;
  selectedMessage: any;
  showModal: boolean = false;
  modalData!: { bodyPart: any; gender: any };
  constructor() {}

  ngOnInit(): void {
    console.log('');
  }

  bodyPartSelected(bodyPart: any) {
    this.selectedMessage = '';
    this.showModal = true;
    this.modalData = {
      bodyPart: bodyPart,
      gender: this.selectedGender
    };
  }
}
