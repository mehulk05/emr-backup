import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class VirtualConsulationService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getServicesByBodyPart(bodyPartName: string, gender: string) {
    let url = '/api/consultationService';
    if (bodyPartName != null && bodyPartName != '') {
      url = url + '?bodyPart=' + bodyPartName;
    } else {
      url = url + '?bodyPart=';
    }
    if (gender != null && gender != '') {
      url = url + '&gender=' + gender;
    } else {
      url = url + '&gender=';
    }
    return this.apiService.get(
      url,
      'Unable to load quick links',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimozedServicesByBodyPart(bodyPartName: string, gender: string) {
    let url = '/api/v1/consultationService';
    if (bodyPartName != null && bodyPartName != '') {
      url = url + '?bodyPart=' + bodyPartName;
    } else {
      url = url + '?bodyPart=';
    }
    if (gender != null && gender != '') {
      url = url + '&gender=' + gender;
    } else {
      url = url + '&gender=';
    }
    return this.apiService.get(
      url,
      'Unable to load quick links',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllServices() {
    const apiUrl = '/api/v1/services/all';
    return this.apiService.get(
      apiUrl,
      'Unable to load Servcies',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllServicesForVC() {
    const apiUrl = '/api/consultationServices';
    return this.apiService.get(
      apiUrl,
      'Unable to load Servcies for Self Assessment',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimizedAllServicesForVC() {
    const apiUrl = '/api/v1/consultationServices';
    return this.apiService.get(
      apiUrl,
      'Unable to load Servcies for Self Assessment',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createVCService(data: any) {
    const apiUrl = '/api/consultationServices';
    return this.apiService.post(
      apiUrl,
      data,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateVCService(consultationServiceId: number, data: any) {
    const apiUrl = '/api/consultationServices/' + consultationServiceId;
    return this.apiService.put(
      apiUrl,
      data,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateOptimizedVCService(consultationServiceId: number, data: any) {
    const apiUrl = '/api/v1/consultationServices/' + consultationServiceId;
    return this.apiService.put(
      apiUrl,
      data,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteVCServiceSymptom(consultationServiceId: number, symptomId: number) {
    const apiUrl =
      '/api/consultationServices?consultationServiceId=' +
      consultationServiceId +
      '&symptomId=' +
      symptomId;
    return this.apiService.delete(
      apiUrl,
      'Unable to delete symptom.',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  addSymptom(data: any) {
    const apiUrl = '/api/symptoms';
    return this.apiService.post(
      apiUrl,
      data,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateSymptom(symptomId: number, data: any) {
    const apiUrl = '/api/symptoms/' + symptomId;
    return this.apiService.put(
      apiUrl,
      data,
      'Unable to update symptom.',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSymptomModel() {
    const apiUrl = '/api/symptomModelService';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createSymptomModel(data: any) {
    const apiUrl = 'api/symptomModelService';
    return this.apiService.post(
      apiUrl,
      data,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateSymtomModel(symptomModelId: number, sMData: any) {
    const apiUrl = '/api/symptomModelService/' + symptomModelId;
    return this.apiService.put(
      apiUrl,
      sMData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateSymptomTitle(symptomModelId: number, data: any) {
    const apiUrl = '/api/title/' + symptomModelId;
    return this.apiService.put(
      apiUrl,
      data,
      'Error while updating title!!',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateSymptomDescription(symptomModelId: number, data: any) {
    const apiUrl = '/api/description/' + symptomModelId;
    return this.apiService.put(
      apiUrl,
      data,
      'Error while updating description!!',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateMaleSymptomDescription(symptomModelId: number, data: any) {
    const apiUrl = '/api/maleDescription/' + symptomModelId;
    return this.apiService.put(
      apiUrl,
      data,
      'Error while updating description!',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateDentalVCDescription(symptomModelId: number, data: any) {
    const apiUrl = '/api/dentalDescription/' + symptomModelId;
    return this.apiService.put(
      apiUrl,
      data,
      'Error while updating description!',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  showMaleModalFirst(symptomModelId: number, data: any) {
    console.log(data);
    const apiUrl = '/api/showMaleModelFirst/' + symptomModelId;
    return this.apiService.put(
      apiUrl,
      data,
      'Error while updating configuration!',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  hideSelectedSymptoms(symptomModelId: number, data: any) {
    console.log(data);
    const apiUrl = '/api/hideSelectedSymptoms/' + symptomModelId;
    return this.apiService.put(
      apiUrl,
      data,
      'Error while updating configuration!',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  genderToHide(symptomModelId: number, data: any) {
    const apiUrl = '/api/genderToHide/' + symptomModelId;
    return this.apiService.put(
      apiUrl,
      data,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getLeadCaptureFormId() {
    const apiUrl = '/api/v1/questionnaire/lead-capture-form-id';
    return this.apiService.get(
      apiUrl,
      'Unable to load Lead Capture Form Id',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSymptomByBodyPartAndSymptomName(
    bodyPart: string,
    gender: string,
    symptomName: string
  ) {
    const apiUrl =
      '/api/public/v1/dental/consultationService?bodyPart=' +
      bodyPart +
      '&gender=' +
      gender +
      '&symptom=' +
      symptomName;
    return this.apiService.get(
      apiUrl,
      'Unable to get symptom.',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
