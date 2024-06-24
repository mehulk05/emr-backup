import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TwoWayTextService } from '../../services/two-way-text.service';

@Component({
  selector: 'app-two-way-text-sms-audit',
  templateUrl: './two-way-text-sms-audit.component.html',
  styleUrls: ['./two-way-text-sms-audit.component.css']
})
export class TwoWayTextSmsAuditComponent implements OnInit, OnChanges {
  @Input() businessInfo: any;
  @Input() userSourceId: any;
  @Input() showOnlyOneUserSource: any;

  rowData: any[] = [];
  totalCount: number = 0;
  sentMessageCount: number = 0;
  receivedMessageCount: number = 0;
  sideBarVisible: boolean = false;
  smsArray: any[] = [];

  constructor(
    private router: Router,
    private twoWayTextService: TwoWayTextService
  ) {}

  ngOnInit(): void {
    this.loadSmsAuditLogs(0, 25);
  }

  ngOnChanges(): void {
    this.loadSmsAuditLogs(0, 25);
  }

  loadSmsAuditLogs(pageNumber: number, pageSize: number) {
    this.twoWayTextService
      .getSmsAuditLogs(pageNumber, pageSize)
      .then((data: any) => {
        if (data) {
          this.rowData = this.showOnlyOneUserSource
            ? data.auditLogs.filter(
                (usr: any) => usr.sourceId == this.userSourceId
              )
            : data.auditLogs;
          this.totalCount = data.totalNumberOfElements;
          this.sentMessageCount = data.sentMessageCount;
          this.receivedMessageCount = data.receivedMessageCount;
        }
      });
  }

  paginate(paginatorConfig: any) {
    this.loadSmsAuditLogs(
      paginatorConfig.currentPage,
      paginatorConfig.noOfRecord
    );
  }

  onActionClicked(event: any) {
    if (event.type == 'view') {
      this.smsArray = event.data.auditLogs || [];
      this.sideBarVisible = true;
    } else if (event.type == 'edit') {
      const modulesName = event.data?.source;
      let module;
      if (modulesName) {
        module =
          modulesName.toLowerCase().includes('lead') ||
          modulesName.toLowerCase().includes('form')
            ? 'Lead'
            : modulesName.toLowerCase().includes('patient') ||
              modulesName.toLowerCase().includes('appointment')
            ? 'Appointment'
            : 'Lead';
      }
      this.router.navigate(['two-way-text', 'sms-audit', 'edit'], {
        queryParams: {
          phoneNumber: event.data.recipient,
          id: event.data.sourceId,
          module: module,
          communication: event.data?.communication
        },
        queryParamsHandling: 'merge'
      });
    }
  }
}
