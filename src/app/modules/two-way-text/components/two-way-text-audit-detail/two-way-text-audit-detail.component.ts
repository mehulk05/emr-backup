import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from 'src/app/modules/leads/service/leads.service';
import { PatientService } from 'src/app/modules/pateint/services/patient.service';
import { TwoWayTextChatComponent } from 'src/app/shared/reusableComponents/two-way-text-chat/two-way-text-chat.component';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import moment from 'moment';
import { TwoWayTextService } from '../../services/two-way-text.service';
import { SmsService } from 'src/app/modules/marketing/sms-template/services/sms.service';
import { BusinessService } from 'src/app/modules/account-and-settings/business/services/business.service';

@Component({
  selector: 'app-two-way-text-audit-detail',
  templateUrl: './two-way-text-audit-detail.component.html',
  styleUrls: ['./two-way-text-audit-detail.component.css']
})
export class TwoWayTextAuditDetailComponent implements OnInit {
  @ViewChild(TwoWayTextChatComponent)
  twoWayTextChatComponent: TwoWayTextChatComponent;
  @ViewChild('filterDropDown') filterDropDown: ElementRef;
  smsArray: any[] = [];
  businessName: string;
  simpleSmsForm: FormGroup;
  phoneNumber: string;
  smsTemplates: any[] = [];
  smsTemplateId: any;
  sourceId: any;
  module: any;
  message = '';
  category = 'Write the summary within 200 characters';
  totalCharacterLength = 200;
  showAiModal = false;
  showTemplatesModal: boolean = false;
  auditLogsList: any[] = [];
  filteredAuditLogsList: any[] = [];
  selectedLogIndex: any = -1;
  chatFilterMenuVisible: boolean = false;
  activeFilters: any[] = [];
  filters: any = {
    chatStatusFilter: this.leadChatStatusFilter,
    searchBoxFilter: this.searchBoxFilter,
    leadMsgReadStatusFilter: this.leadMsgReadStatusFilter,
    leadSourceTypeFilter: this.leadSourceTypeFilter,
    leadSourceNameFilter: this.leadSourceNameFilter,
    leadAgeFilter: this.leadAgeFilter
  };
  chatStatusFilter: string = 'OPEN';
  msgReadStatus: string = 'All';
  sourceTypeFilter: string = '';
  sourceNameFilter: string = '';
  sourceAgeFilter: string = '';
  enableTwoWayAiAutoSuggestion = false;
  unreadCount: number;
  messageBody: string = '';
  source: string = '';
  businessInfo: any;
  businessNumber: string = '';
  isTwilioEnabled: boolean = false;
  totalNumberOfChats: number = 0;
  pageSize: number = 15;
  searchText: string = '';
  allCount: number = 0;
  closedCount: number = 0;
  closedUnreadCount: number = 0;
  sourceList: string[] = [
    'Form',
    'Manual',
    'ChatBot',
    'Landing Page',
    'Facebook',
    'Self Assessment'
  ];
  showAddLeadModal: boolean = false;
  modalData: any = {};
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private leadService: LeadsService,
    private patientService: PatientService,
    private alertService: ToasTMessageService,
    private twoWayTextService: TwoWayTextService,
    private localStorageService: LocalStorageService,
    private smsService: SmsService,
    private businessService: BusinessService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data.source;
      this.msgReadStatus = data.filter || this.msgReadStatus;
      this.simpleSmsForm = this.formBuilder.group({
        body: ['', [Validators.required]],
        phoneNumber: [this.phoneNumber, [Validators.required]]
      });
      this.loadSmsAuditLogs();
      if (this.module) {
        this.loadSMSTemplates();
      }
      this.businessInfo = this.localStorageService.readStorage('businessInfo');
      if (this.businessInfo) {
        this.setBusinessData();
      } else {
        this.loadBusiness();
      }
    });
  }

  loadBusiness() {
    const loggedInUser = this.localStorageService.readStorage('loggedInUser');
    this.businessService
      .getBusinessOptimized(loggedInUser?.businessId)
      .then((response: any) => {
        this.businessInfo = response;
        this.localStorageService.storeItem('businessInfo', this.businessInfo);
        this.setBusinessData();
      });
  }

  setBusinessData() {
    this.businessName = this.businessInfo?.name;
    this.enableTwoWayAiAutoSuggestion =
      this.businessInfo?.enableAiTwoWaySMSSuggestion;
    if (this.businessInfo?.getTwilioNumber && this.businessInfo.twilioNumber) {
      this.isTwilioEnabled = true;
      this.businessNumber = this.businessInfo.twilioNumber;
    } else {
      this.twoWayTextService.getDefaultNumber().then((response: any) => {
        this.businessNumber = response.defaultNumber;
      });
    }
  }

  setUnreadCount() {
    let unreadCount = 0;
    let closedUnreadCount = 0;
    this.auditLogsList?.forEach((log: any) => {
      if (!log.lastMessageRead) {
        if (log.leadChatStatus === 'OPEN') {
          unreadCount++;
        } else if (log.leadChatStatus === 'CLOSE') {
          closedUnreadCount++;
        }
      }
    });
    this.unreadCount = unreadCount;
    this.closedUnreadCount = closedUnreadCount;
  }

  markLogsAsRead() {
    if (
      this.selectedLogIndex === undefined ||
      this.selectedLogIndex === null ||
      this.selectedLogIndex < 0
    ) {
      return;
    }
    const logIds = this.auditLogsList[this.selectedLogIndex].auditLogs
      .filter((log: any) => log.direction === 'incoming')
      .map((log: any) => log.id);
    if (logIds) {
      this.twoWayTextService.markLogsAsRead(logIds.join(',')).then(
        (response) => {
          this.auditLogsList[this.selectedLogIndex].lastMessageRead = response;
          if (this.msgReadStatus != 'All') {
            this.msgReadStatus = 'All';
            this.updateFilterAndOptions('leadMsgReadStatusFilter', {
              msgReadStatus: 'All'
            });
          }
          this.smsService.reduceAndEmitUnreadSmsCount(logIds.length);
          this.setUnreadCount();
          this.applyFilters();
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      );
    }
  }

  loadSmsAuditLogs() {
    this.twoWayTextService
      .getSmsAuditLogsList(0, this.pageSize, this.searchText)
      .then((data: any) => {
        if (data && data.auditLogsList) {
          this.totalNumberOfChats = data.totalNumberOfElements ?? 0;
          const logs = data.auditLogsList.sort((a: any, b: any) => {
            return moment(b.lastMessageDate).diff(moment(a.lastMessageDate));
          });
          this.auditLogsList = [...logs];

          if (this.sourceId !== null && this.sourceId !== undefined) {
            this.selectedLogIndex = this.auditLogsList.findIndex(
              (logs) => logs.sourceId == this.sourceId
            );
          }
          if (this.selectedLogIndex !== -1) {
            this.sourceId = this.auditLogsList[this.selectedLogIndex].sourceId;
            this.chatStatusFilter =
              this.auditLogsList[this.selectedLogIndex].leadChatStatus;
          }
          this.activeFilters = [];
          this.activeFilters.push({
            name: 'chatStatusFilter',
            filterFunction: this.filters['chatStatusFilter'],
            options: {
              chatStatusFilter: this.chatStatusFilter
            }
          });
          this.activeFilters.push({
            name: 'leadMsgReadStatusFilter',
            filterFunction: this.filters['leadMsgReadStatusFilter'],
            options: {
              msgReadStatus: this.msgReadStatus
            }
          });
          this.applyFilters();
          this.setUnreadCount();
          if (this.selectedLogIndex !== -1) {
            if (!this.auditLogsList[this.selectedLogIndex].lastMessageRead) {
              this.markLogsAsRead();
            }
          }
        }
      });
  }

  loadNextPage() {
    const nextPage = this.auditLogsList.length / this.pageSize;
    this.twoWayTextService
      .getSmsAuditLogsList(nextPage, this.pageSize, this.searchText)
      .then((data: any) => {
        const logs = data.auditLogsList.sort((a: any, b: any) => {
          return moment(b.lastMessageDate).diff(moment(a.lastMessageDate));
        });
        this.auditLogsList.push(...logs);
        this.applyFilters();
      });
  }

  loadSMSTemplates() {
    this.smsTemplates = undefined;
    this.leadService
      .getSMSTemplatesListForLead(this.module, this.sourceId)
      .then(
        (response: any) => {
          this.smsTemplates = response;
        },
        (error: any) => {
          if (error?.status === 404) {
            // this.auditLogsList[this.selectedLogIndex].isDeleted = true;
          } else {
            this.alertService.error('Unable to load the sms templates.');
          }
        }
      );
  }

  sendSimpleSms() {
    if (this.simpleSmsForm.valid) {
      let service;
      const formData = this.simpleSmsForm.value;
      let sourceId = this.sourceId;
      if (sourceId === null) {
        const logsList = this.auditLogsList[this.selectedLogIndex].auditLogs;
        for (let i = logsList.length - 1; i >= 0; i--) {
          if (logsList[i].direction === 'outgoing') {
            sourceId = logsList[i].sourceId;
            break;
          }
        }
      }
      if (this.module == 'Lead') {
        service = this.leadService;
        formData['leadId'] = sourceId;
      } else {
        service = this.patientService;
        formData['patientId'] = sourceId;
      }
      service.sendSimpleSms(formData).then(
        (res: any) => {
          if (res && res.status == 200) {
            this.simpleSmsForm.reset();
            this.simpleSmsForm.patchValue({
              phoneNumber: this.phoneNumber
            });
            this.loadSmsAuditLogs();
            this.messageBody = '';
            this.twoWayTextChatComponent.setMessageBody('');
          } else {
            let msg = 'Error while sending SMS';
            if (res?.status == 500 && res?.errorMessage) {
              msg = res.errorMessage;
            }
            this.alertService.error(msg);
          }
        },
        (e: any) => {
          if (e.message) this.alertService.error(e.message);
          else
            this.alertService.error(
              'System error occured. Please try again or contact support'
            );
        }
      );
    }
  }

  sendSMS() {
    if (!this.smsTemplateId) return;
    const service =
      this.module == 'Lead' ? this.leadService : this.patientService;
    service.sendSMS(this.sourceId, this.smsTemplateId).then(
      () => {
        this.alertService.success('SMS Sent Successfully.');
        this.smsTemplateId = '';
      },
      () => {
        this.alertService.error('Unable to send SMS.');
      }
    );
  }

  sendCustomSms(message: string) {
    this.simpleSmsForm.controls['body'].setValue(message);
    this.sendSimpleSms();
  }

  showHideTemplatesDialog(e: any) {
    this.showTemplatesModal = e;
    if (!e) {
      this.twoWayTextChatComponent.hideTemplateDialog('');
    }
  }

  templateSelected(e: any) {
    if (e && e.body) {
      this.twoWayTextChatComponent.setMessageBody(e.body);
    }
  }

  changeSelectedLogIndex(i: any) {
    const selecteLog = this.filteredAuditLogsList[i];
    this.selectedLogIndex = this.auditLogsList.findIndex(
      (logs) =>
        logs.sourceId == selecteLog.sourceId &&
        logs.sourcePhoneNumber === selecteLog.sourcePhoneNumber &&
        logs.lastMessageDate === selecteLog.lastMessageDate
    );

    this.sourceId = this.auditLogsList[this.selectedLogIndex].sourceId;
    this.phoneNumber =
      this.auditLogsList[this.selectedLogIndex].sourcePhoneNumber;
    this.simpleSmsForm.patchValue({
      phoneNumber: this.auditLogsList[this.selectedLogIndex].sourcePhoneNumber
    });
    if (this.auditLogsList[this.selectedLogIndex].source) {
      const modulesName = this.auditLogsList[this.selectedLogIndex].source;
      if (modulesName) {
        this.module =
          modulesName.toLowerCase().includes('lead') ||
          modulesName.toLowerCase().includes('form')
            ? 'Lead'
            : modulesName.toLowerCase().includes('patient') ||
              modulesName.toLowerCase().includes('appointment')
            ? 'Appointment'
            : 'Lead';
      }
      if (this.auditLogsList[this.selectedLogIndex].sourceId !== null) {
        this.loadSMSTemplates();
      }
    }
    if (!this.auditLogsList[this.selectedLogIndex].lastMessageRead) {
      this.markLogsAsRead();
    }
  }

  toggleChatFilterMenu() {
    this.chatFilterMenuVisible = !this.chatFilterMenuVisible;
    if (this.chatFilterMenuVisible) {
      setTimeout(() => {
        this.filterDropDown.nativeElement.focus();
      }, 0);
    }
  }

  filterAuditLogsList(e: any) {
    const searchText = e.target?.value ?? '';
    this.updateFilterAndOptions('searchBoxFilter', { searchText });
    this.applyFilters();
  }

  setStatusCounts() {
    if ('Unread' !== this.msgReadStatus) {
      this.allCount = this.filteredAuditLogsList.length;
      this.closedCount = this.filteredAuditLogsList.filter(
        (log) => log.leadChatStatus === 'CLOSE'
      ).length;
    }
  }

  onSearchEnter(e: any) {
    if (e.defaultPrevented) return;
    this.loadSmsAuditLogs();
  }

  chatStatusChange(status: string) {
    this.leadService
      .updatSmsChatStatus(
        this.sourceId,
        status,
        this.module === 'Lead' ? 'lead' : 'patient'
      )
      .then(
        () => {
          this.auditLogsList[this.selectedLogIndex].leadChatStatus = status;
          this.toggleChatStatusFilter(status);
          this.alertService.success('Status changed successfully.');
        },
        () => {
          this.alertService.error('Unable to change status.');
        }
      );
  }

  toggleChatStatusFilter(status: string) {
    this.chatStatusFilter = status;
    this.updateFilterAndOptions('chatStatusFilter', {
      chatStatusFilter: this.chatStatusFilter
    });
    this.msgReadStatus = 'All';
    this.updateFilterAndOptions('leadMsgReadStatusFilter', {
      msgReadStatus: this.msgReadStatus
    });
    this.applyFilters();
  }

  toggleMsgReadStatusFilter(status: string) {
    this.msgReadStatus = status;
    this.updateFilterAndOptions('leadMsgReadStatusFilter', {
      msgReadStatus: this.msgReadStatus
    });
    this.applyFilters();
  }

  toggleSourceTypeFilter(type: string) {
    if (this.sourceTypeFilter === type) {
      this.sourceTypeFilter = '';
      this.removeFilter('leadSourceTypeFilter');
    } else {
      this.sourceTypeFilter = type;
      this.updateFilterAndOptions('leadSourceTypeFilter', {
        source: type
      });
    }
    this.applyFilters();
  }

  toggleSourceNameFilter(sourceName: string) {
    if (this.sourceNameFilter === sourceName) {
      this.sourceNameFilter = '';
      this.removeFilter('leadSourceNameFilter');
    } else {
      this.sourceNameFilter = sourceName;
      this.updateFilterAndOptions('leadSourceNameFilter', {
        sourceName: sourceName,
        sourceList: this.sourceList
      });
    }
    this.applyFilters();
  }

  toggleLeadAgeFilter(leadAge: string) {
    if (this.sourceAgeFilter === leadAge) {
      this.sourceAgeFilter = '';
      this.removeFilter('leadAgeFilter');
    } else {
      this.sourceAgeFilter = leadAge;
      this.updateFilterAndOptions('leadAgeFilter', {
        minAge: leadAge.split('-')[0],
        maxAge: leadAge.split('-')[1],
        getDaysFromToday: this.getDaysFromToday
      });
    }
    this.applyFilters();
  }

  updateFilterAndOptions(filterName: string, options: object) {
    const filter = this.activeFilters.find(
      (filter) => filter.name === filterName
    );
    if (filter) {
      filter.options = options;
    } else {
      this.activeFilters.push({
        name: filterName,
        filterFunction: this.filters[filterName],
        options
      });
    }
  }

  removeFilter(filterName: string) {
    this.activeFilters = this.activeFilters.filter(
      (filter) => filter.name !== filterName
    );
  }

  applyFilters() {
    let filteredList = [...this.auditLogsList];
    this.activeFilters.forEach((filter) => {
      filteredList = filteredList.filter(filter.filterFunction, filter.options);
    });
    this.filteredAuditLogsList = [...filteredList];
    this.setStatusCounts();
    // console.log(this.filteredAuditLogsList);
  }

  // filters
  searchBoxFilter(this: any, log: any) {
    return (
      log.leadFullName
        .toLocaleLowerCase()
        .includes(this.searchText.toLocaleLowerCase()) ||
      (log.sourcePhoneNumber && log.sourcePhoneNumber.includes(this.searchText))
    );
  }

  leadChatStatusFilter(this: any, log: any) {
    return log.leadChatStatus === this.chatStatusFilter;
  }

  leadMsgReadStatusFilter(this: any, log: any) {
    return (
      this.msgReadStatus === 'All' ||
      ('Unread' === this.msgReadStatus && !log.lastMessageRead)
    );
  }

  leadSourceTypeFilter(this: any, log: any) {
    return log.source === this.source;
  }

  leadSourceNameFilter(this: any, log: any) {
    return this.sourceName === 'Other'
      ? !this.sourceList.includes(log.sourceName)
      : log.sourceName === this.sourceName;
  }

  leadAgeFilter(this: any, log: any) {
    const daysFromToday = this.getDaysFromToday(log.lastMessageDate);
    return daysFromToday >= this.minAge && daysFromToday < this.maxAge;
  }

  getDaysFromToday(date: string) {
    return moment().diff(moment(moment(date).format('yyyy-MM-DD')), 'days');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterDropDownBlur(e: any) {
    this.chatFilterMenuVisible = false;
  }

  onBackPressed() {
    this.router.navigate(['two-way-text'], {
      queryParams: {
        source: 'smsAudit'
      }
    });
  }

  addAsLead(auditLog: any) {
    console.log(auditLog);
    this.showAddLeadModal = true;
    let phoneNumber =
      auditLog?.sourcePhoneNumber == auditLog?.leadFullName
        ? auditLog?.sourcePhoneNumber
        : auditLog?.leadFullName;
    phoneNumber = phoneNumber.includes('+')
      ? phoneNumber.slice(2)
      : phoneNumber;
    this.modalData = {
      phoneNumber
    };
  }

  onAddLeadCloseModal(e: any) {
    console.log(e);
    this.showAddLeadModal = false;
    if (e.isRefresh) {
      this.twoWayTextService
        .updateLeadIdForNumber(e.data?.leadId, this.modalData.phoneNumber)
        .then(
          () => {
            this.loadSmsAuditLogs();
          },
          () => {
            this.alertService.error('Unable to update lead');
          }
        );
    }
  }
}
