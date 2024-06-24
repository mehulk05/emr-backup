import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getAllTasks() {
    const apiUrl = '/api/workflowtasks/all';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createTask(taskForm: any) {
    const apiUrl = '/api/workflowtasks';
    return this.apiService.post(
      apiUrl,
      taskForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateTask(taskId: number, taskForm: any) {
    const apiUrl = '/api/workflowtasks/' + taskId;
    return this.apiService.put(
      apiUrl,
      taskForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteTask(id: any) {
    const apiUrl = '/api/workflowtasks/' + id;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptmizedAllUsers() {
    const apiUrl = '/api/v1/users/all';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptmizedAllPatients() {
    const apiUrl = '/api/v1/patients/all';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptmizedAllLeads() {
    const apiUrl = '/api/questionnaire-submission/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDefaultCinic() {
    const apiUrl = '/api/clinics/default';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getTasks(page: number, size: number) {
    let apiUrl = '/api/workflowtasks';
    apiUrl = apiUrl + `?page=` + page + `&size=` + size;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getTask(taskId: number) {
    const apiUrl = '/api/workflowtasks/' + taskId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateLead(leadId: number, leadForm: any) {
    const apiUrl = '/api/questionnaire-submissions/' + leadId + '/lead';
    return this.apiService.put(
      apiUrl,
      leadForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
