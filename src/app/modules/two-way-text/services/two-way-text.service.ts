import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';

@Injectable({
  providedIn: 'root'
})
export class TwoWayTextService {
  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getSmsAuditLogs(pageNumber: number, pageSize: number) {
    const apiUrl = `/api/notifications/sms-audit-logs?pageNum=${pageNumber}&pageSize=${pageSize}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getPhoneNumberAuditLogs(phoneNumber: string) {
    const apiUrl = `/api/notifications/sms-audit-logs/${phoneNumber}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSourceAuditLogs(sourceId: string) {
    const apiUrl = `/api/notifications/sms-audit-logs/source/${sourceId}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getSmsAuditLogsList(
    pageNumber: number,
    pageSize: number,
    searchText?: string
  ) {
    const apiUrl = `/api/v1/notifications/sms-audit-logs?pageNum=${pageNumber}&pageSize=${pageSize}&searchText=${searchText}`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  markLogsAsRead(logIds: any) {
    const apiUrl = `/api/notifications/sms-audit-logs/mark-as-read?logIds=${logIds}`;
    return this.apiService.put(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getDefaultNumber() {
    const apiUrl = `/api/notifications/default-number`;
    return this.apiService.get(
      apiUrl,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  updateLeadIdForNumber(leadId: any, phoneNumber: string) {
    const apiUrl = `/api/notifications/leadId-for-number?leadId=${leadId}&phoneNumber=${phoneNumber}`;
    return this.apiService.put(
      apiUrl,
      '',
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
