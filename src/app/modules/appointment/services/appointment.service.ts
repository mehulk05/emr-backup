import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getAppointments() {
    const apiUrl = '/api/v1/appointments';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAppointmentsByPage(search: string, page: number, size: number) {
    const apiUrl =
      '/api/v1/appointments/page?search=' +
      search +
      '&page=' +
      page +
      '&size=' +
      size;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAppointmentPayments(appointmentId: any) {
    const apiUrl = '/api/payment/appointment?appointmentId=' + appointmentId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAppointmentPatients(tag: string, status: string) {
    if (!tag) {
      tag = '';
    }
    if (!status) {
      status = '';
    }
    const apiUrl = '/api/v1/patients/all?tag=' + tag + '&status=' + status;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAppointmentPatientsByPage(
    tag: string,
    status: string,
    startDate: string,
    endDate: string,
    search: string,
    page: any,
    size: any
  ) {
    if (!tag) {
      tag = '';
    }
    if (!status) {
      status = '';
    }
    if (!search) {
      search = '';
    }
    tag = encodeURIComponent(tag);
    const apiUrl =
      '/api/v1/patients/all/page?tag=' +
      tag +
      '&status=' +
      status +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate +
      '&search=' +
      search +
      '&page=' +
      page +
      '&size=' +
      size;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  patientTagList() {
    const apiUrl = '/api/ptag/list';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  cancelAppointment(appointmentId: number) {
    const apiUrl = '/api/appointments/' + appointmentId + '/cancel';
    return this.apiService.get(
      apiUrl,
      'Unable to cancel appointments',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteAppointment(appointmentId: number) {
    const apiUrl = '/api/appointments/' + appointmentId;
    return this.apiService.delete(
      apiUrl,
      'Unable to delete paid appointments',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteAppointmentService(
    appointmentId: number,
    appointmentServiceId: number
  ) {
    const apiUrl =
      '/api/appointments/' + appointmentId + '/service/' + appointmentServiceId;
    return this.apiService.delete(
      apiUrl,
      null,
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimizedfilterAppointments(
    clinicId: any,
    providerId: any,
    serviceId: any
  ) {
    let apiUrl = '/api/v1/appointments/filter';
    if (clinicId != null && clinicId != '') {
      apiUrl = apiUrl + '?clinicId=' + clinicId;
    } else {
      apiUrl = apiUrl + '?clinicId=';
    }
    apiUrl = apiUrl + '&providerId=' + providerId;
    apiUrl = apiUrl + '&serviceId=' + serviceId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimizedfilterAppointmentsByPage(
    clinicId: any,
    providerId: any,
    serviceId: any,
    search: any,
    startDate: string,
    endDate: string,
    page: any,
    size: any
  ) {
    let apiUrl = '/api/v1/appointments/filter/all';
    if (clinicId != null && clinicId != '') {
      apiUrl = apiUrl + '?clinicId=' + clinicId;
    } else {
      apiUrl = apiUrl + '?clinicId=';
    }
    apiUrl = apiUrl + '&providerId=' + providerId;
    if (serviceId != null && serviceId != '') {
      apiUrl = apiUrl + '&serviceId=' + serviceId;
    } else {
      apiUrl = apiUrl + '&serviceId=0';
    }
    // apiUrl = apiUrl + '&serviceId=' + serviceId;
    apiUrl =
      apiUrl +
      '&search=' +
      search +
      '&page=' +
      page +
      '&size=' +
      size +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimizedCalendarfilterAppointments(
    clinicId: any,
    providerId: any,
    serviceId: any,
    startDate: any,
    endDate: any
  ) {
    let apiUrl = `/api/v1/appointments/calendar/filter`;
    if (clinicId != null && clinicId != '') {
      apiUrl = apiUrl + '?clinicId=' + clinicId;
    } else {
      apiUrl = apiUrl + '?clinicId=';
    }
    apiUrl = apiUrl + '&providerId=' + providerId;
    apiUrl = apiUrl + '&serviceId=' + serviceId;
    apiUrl = apiUrl + '&startDate=' + startDate;
    apiUrl = apiUrl + '&endDate=' + endDate;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimizedSingleAppointment(appointmentId: number) {
    const apiUrl = '/api/v1/appointments/' + appointmentId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSingleAppointment(appointmentId: number) {
    const apiUrl = '/api/appointments/' + appointmentId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllOptimizedCinicList() {
    const apiUrl = '/api/v1/clinics/all';
    return this.apiService.get(
      apiUrl,
      'Unable to load the clinics at the moment',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllProvidersForDropDown() {
    const apiUrl = '/api/v1/providers/dropDown';
    return this.apiService.get(
      apiUrl,
      'Unable to load the providers at the moment',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAllServicesForDropdown(clinicId: any) {
    const apiUrl = clinicId
      ? '/api/v1/services/dropDown?clinicId=' + clinicId
      : '/api/v1/services/dropDown';
    return this.apiService.get(
      apiUrl,
      'Unable to load the services at the moment',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAvailableTimeslots(
    clinicId: any,
    serviceIds: any,
    providerId: any,
    date: any,
    appointmentId: any
  ) {
    const request = {
      date: date,
      clinicId: clinicId,
      providerId: providerId,
      serviceIds: serviceIds,
      appointmentId: appointmentId
    };
    const apiUrl = '/api/provider/' + providerId + '/schedules/times';
    return this.apiService.post(
      apiUrl,
      request,
      'Unable to load Time slot',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAvailableDates(clinicId: any, serviceIds: any, providerId: any) {
    const request = {
      clinicId: clinicId,
      providerId: providerId,
      serviceIds: serviceIds
    };
    const apiUrl = '/api/provider/' + providerId + '/schedules/dates';
    return this.apiService.post(
      apiUrl,
      request,
      'Unable to load the avaialable dates',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getClinicAvailableDates(clinicId: any, serviceIds: any) {
    const request = {
      clinicId: clinicId,
      serviceIds: serviceIds
    };
    const apiUrl = '/api/clinic/' + clinicId + '/schedules/times';
    return this.apiService.post(
      apiUrl,
      request,
      'Unable to load the avaialable dates',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateAppointment(appointmentId: number, appointmentForm: any) {
    const apiUrl = '/api/appointments/' + appointmentId;
    return this.apiService.put(
      apiUrl,
      appointmentForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateAppointmentDate(appointmentId: number, appointmentForm: any) {
    const apiUrl = '/api/appointments/' + appointmentId + '/date';
    return this.apiService.put(
      apiUrl,
      appointmentForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createAppointment(appointmentForm: any) {
    const apiUrl = '/api/appointments';
    return this.apiService.post(
      apiUrl,
      appointmentForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  createNewAppointment(appointmentForm: any) {
    const apiUrl = '/api/appointments/new';
    return this.apiService.post(
      apiUrl,
      appointmentForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateAppointmentTotalCost(appointmentId: number, appointmentForm: any) {
    const apiUrl = '/api/appointments/' + appointmentId + '/totalcost';
    return this.apiService.put(
      apiUrl,
      appointmentForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateAppointmentService(appointmentId: number, appointmentForm: any) {
    const apiUrl = '/api/appointments/' + appointmentId + '/service';
    return this.apiService.put(
      apiUrl,
      appointmentForm,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getBusinessOptimized(businessId: any) {
    const apiUrl = '/api/v1/businesses/' + businessId;
    return this.apiService.get(
      apiUrl,
      'Unable to load Business Information',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getProviderServices(clinicId: any, providerId: any) {
    let apiUrl = '/api/services/clinics/' + clinicId;
    if (providerId != null) {
      apiUrl += '?providerId=' + providerId;
    }
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getProviderServicesOptimised(clinicId: any, providerId: any) {
    let apiUrl = '/api/v1/services/clinics/' + clinicId;
    if (providerId != null) {
      apiUrl += '?providerId=' + providerId;
    }
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  addServices(appointmentId: any, serviceIds: any) {
    const apiUrl =
      '/api/appointments/' +
      appointmentId +
      '/services?serviceIds=' +
      serviceIds;
    return this.apiService.put(
      apiUrl,
      {},
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  public getBookingHistoryExcel() {
    const apiUrl = '/api/appointments/excel';
    return this.apiService.getPdf(
      apiUrl,
      {},
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getBookingHistoryPDF() {
    const apiUrl = '/api/appointments/pdf';
    return this.apiService.getPdf(
      apiUrl,
      {},
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getOptimizedAppointments() {
    const apiUrl = '/api/v1/appointments';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAppointmentsOptimised() {
    const apiUrl = '/api/v1/appointments/optimised';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAppointmentsOptimisedBookingDetails() {
    const apiUrl = '/api/v1/appointments/optimised/bookingDetails';
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getconcentAppoinment(id: any) {
    const apiUrl = '/api/appointments/consents/' + id;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  sendInvoiceEmail(appointmentId: any) {
    const apiUrl = '/api/payment/appointment/' + appointmentId + '/email';
    return this.apiService.getText(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptionsForHtml()
    );
  }

  getProviderByServiceIds(serviceIds: any) {
    let apiUrl = '/api/v1/users/services/providers';
    if (serviceIds != null && serviceIds != '') {
      apiUrl = apiUrl + '?serviceId=' + serviceIds;
    } else {
      apiUrl = apiUrl + '?serviceId=';
    }
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getTimeSlotsWithoutProvider(businessId: any, formData: any) {
    const apiUrl = '/api/public/clinic/' + formData.clinicId + '/times';
    return this.apiService.post(
      apiUrl,
      formData,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getClinic(businessId: any, clinicId: any) {
    const apiUrl = '/api/public/clinics/' + clinicId;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getAppointmentCountForBusiness(businessId: any) {
    const apiUrl = `/api/v1/appointments/business/${businessId}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions(businessId)
    );
  }

  getAppointmentsExportList(appointmentIds: any) {
    const apiUrl = '/api/v1/appointments/export/list';
    return this.apiService.post(
      apiUrl,
      appointmentIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  deleteAppointmentsMass(appointmentIds: any) {
    const apiUrl = '/api/appointments/mass-delete';
    return this.apiService.put(
      apiUrl,
      appointmentIds,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAppointmentDashboardData(
    serviceIds: any,
    userId?: any,
    appointmentStats: boolean = false
  ) {
    let apiUrl = `/api/v1/appointments/dashboard?`;
    if (serviceIds !== null && serviceIds !== '') {
      apiUrl = apiUrl + 'serviceId=' + serviceIds;
    } else {
      apiUrl = apiUrl + 'serviceId=';
    }
    if (userId !== null && userId !== undefined) {
      apiUrl = apiUrl + '&userId=' + userId;
    }
    if (appointmentStats) {
      apiUrl = apiUrl + '&appointmentStats=' + appointmentStats;
    }
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
