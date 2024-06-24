import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getAllCategories() {
    const apiUrl = '/api/public/v1/serviceCategories/all';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteCategory(serviceId: number) {
    const apiUrl = '/api/servicecategories/' + serviceId;
    return this.apiService.delete(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getCategoryServices(categoryId: number) {
    const apiUrl = '/api/services/category/' + categoryId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  loadCategoryById(categoryId: number) {
    const apiUrl = '/api/servicecategories/' + categoryId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createServiceCategory(serviceCategoryForm: any) {
    const apiUrl = '/api/servicecategories';
    return this.apiService.post(
      apiUrl,
      serviceCategoryForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateServiceCategory(categoryId: number, serviceCategoryForm: any) {
    const apiUrl = '/api/servicecategories/' + categoryId;
    return this.apiService.put(
      apiUrl,
      serviceCategoryForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getClinicServiceCategories(clinicId: any) {
    let apiUrl = '/api/clinics/servicecategories';
    if (clinicId != null && clinicId != '') {
      apiUrl = apiUrl + '?clinicId=' + clinicId;
    } else {
      apiUrl = apiUrl + '?clinicId=';
    }
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimizedClinicServiceCategories(clinicId: any) {
    let apiUrl = '/api/v1/clinics/servicecategories';
    if (clinicId != null && clinicId != '') {
      apiUrl = apiUrl + '?clinicId=' + clinicId;
    } else {
      apiUrl = apiUrl + '?clinicId=';
    }
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  //To save the changed indexes of the rows.
  updateTableList(serviceList: any) {
    const apiUrl = '/api/servicecategories/position';
    return this.apiService.put(
      apiUrl,
      serviceList,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
