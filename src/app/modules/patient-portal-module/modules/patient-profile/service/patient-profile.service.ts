import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class PatientProfileService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getPatientOptimized(id: number) {
    const apiUrl = '/api/patients/' + id;
    return this.apiService.get(
      apiUrl,
      'Unable to load Paitent Details !',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createPatient(patientForm: any) {
    const apiUrl = '/api/patients';
    return this.apiService.post(
      apiUrl,
      patientForm,
      'Unable to create the patient at the moment',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updatePatient(id: number, patientForm: any) {
    const apiUrl = '/api/patients/' + id;
    return this.apiService.put(
      apiUrl,
      patientForm,
      'Unable to update Patient at the moment!',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  uploadImage(userId: number, formData: FormData) {
    const apiUrl = '/api/users/' + userId + '/profile';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  public deleteProfile(userId: any) {
    const apiUrl = '/api/users/' + userId + '/profile/delete';
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getUserById(id: any) {
    const apiUrl = '/api/users/' + id;

    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  changePassword(formData: any) {
    const url = '/api/users/change-password';
    return this.apiService.post(
      url,
      formData,
      'Old password entered is not correct',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
