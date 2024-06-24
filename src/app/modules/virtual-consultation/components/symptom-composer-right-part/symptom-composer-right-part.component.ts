import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { User } from 'src/app/shared/models/user/user';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { VirtualConsulationService } from '../../services/virtual-consulation.service';

@Component({
  selector: 'app-symptom-composer-right-part',
  templateUrl: './symptom-composer-right-part.component.html',
  styleUrls: ['./symptom-composer-right-part.component.css']
})
export class SymptomComposerRightPartComponent implements OnInit, OnChanges {
  @Input() selectedSide: any;
  @Input() selectedFemaleModel: any;
  @Input() selectedMaleModel: any;
  @Output() modalChangeEmitter = new EventEmitter<any>();
  @Output() genderChangeEmiiter = new EventEmitter<any>();
  @Output() vcConfigChangeEmitter = new EventEmitter<any>();
  @Output() hideSelectedSymptomsEmitter = new EventEmitter<any>();

  @Input() genderToHide = 'none';
  @Input() showMaleModelFirst: boolean;
  @Input() hideSelectedSymptoms: boolean;
  selectedGender = 'female';

  loggedInUser!: User;
  symptomSelectorLink: string = '';
  symptomSelectorIframe: string = '';
  domain = environment.OLD_EMR_DOMAIN;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private virtualService: VirtualConsulationService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.readStorage('currentuser');
    if (this.loggedInUser && Object.keys(this.loggedInUser?.businessId)) {
      this.getLeadCaptureFormId();
    } else {
      this.authService.currentUserSubject.subscribe((data: any) => {
        this.loggedInUser = data;
        this.getLeadCaptureFormId();
      });
    }
  }

  ngOnChanges(): void {
    if (this.showMaleModelFirst || this.genderToHide === 'female') {
      this.selectGender('male');
    }
  }

  async getLeadCaptureFormId() {
    const questionnaire: any = await this.virtualService.getLeadCaptureFormId();
    this.symptomSelectorLink =
      this.domain +
      '/assets/static/composer.html?bid=' +
      this.loggedInUser.businessId +
      '&fid=' +
      questionnaire.id;

    this.symptomSelectorIframe =
      '<iframe style="height:700px;width:1200px;border:0" src="' +
      this.symptomSelectorLink +
      '" title="Contact Form"></iframe>';
  }

  selectGender(gender: string) {
    this.selectedGender = gender;
    this.genderChangeEmiiter.emit(gender);
  }

  onModelClick(index: number) {
    if (this.selectedGender === 'male') {
      this.selectedMaleModel = index;
    } else {
      this.selectedFemaleModel = index;
    }
    this.modalChangeEmitter.emit(index);
  }

  onGenderToHideChange() {
    console.log(this.showMaleModelFirst);
    if (this.genderToHide === 'male') {
      this.showMaleModelFirst = false;
      this.selectedGender = 'female';
    } else if (this.genderToHide === 'female') {
      this.selectedGender = 'male';
    }
    this.genderChangeEmiiter.emit(this.selectedGender);
    this.vcConfigChangeEmitter.emit({
      showMaleModelFirst: this.showMaleModelFirst,
      genderToHide: this.genderToHide
    });
  }

  onShowMaleModalFirstChange() {
    this.selectedGender = this.showMaleModelFirst ? 'male' : 'female';
    this.genderChangeEmiiter.emit(this.selectedGender);
    this.vcConfigChangeEmitter.emit({
      showMaleModelFirst: this.showMaleModelFirst,
      genderToHide: this.genderToHide
    });
  }

  onHideSelectedSymptomsChange() {
    console.log(this.hideSelectedSymptoms);
    this.hideSelectedSymptomsEmitter.emit({
      hideSelectedSymptoms: this.hideSelectedSymptoms
    });
  }
}
