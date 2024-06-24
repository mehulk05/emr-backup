import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { LeadsService } from '../../service/leads.service';

@Component({
  selector: 'app-lead-hisory-tab4',
  templateUrl: './lead-hisory-tab4.component.html',
  styleUrls: ['./lead-hisory-tab4.component.css']
})
export class LeadHisoryTab4Component implements OnInit, OnChanges {
  showModal: boolean = false;
  modalData: any;
  @Output() afteronViewLeadDetail = new EventEmitter<any>();
  @Input() leadDetailObj: any;

  globalFilterColumn = [
    'id',
    'fullName',
    'Email',
    'Phone Number',
    'createdAt',
    'leadStatus',
    'leadSource'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'fullName' },
    { header: 'Email', field: 'Email' },
    { header: 'Phone', field: 'Phone Number' },
    { header: 'Source', field: 'leadSource' },
    { header: 'Lead Status', field: 'leadStatus' },
    { header: 'Landing Page', field: 'landingPage' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];

  constructor(
    private leadService: LeadsService,
    public formatTimeService: FormatTimeService,
    private toastService: ToasTMessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    console.log(this.leadDetailObj);
  }

  ngOnChanges(): void {
    console.log(this.leadDetailObj);
    if (this.leadDetailObj && this.leadDetailObj?.emailPlaceId) {
      console.log(this.leadDetailObj);
      if (this.leadDetailObj.emailPlaceId === 'noreply@noreply.com') {
        this.getDuplicateLeadByEmailAndQuestionId();
      } else {
        this.getDuplicateLeadByEmail();
      }
    }
  }

  getDuplicateLeadByEmail() {
    this.leadService
      .getDuplicateLeadDetail(this.leadDetailObj.emailPlaceId)
      .then((data: any) => {
        this.rowData = data;
        const leadIds: any[] = [];
        data.forEach((lead: any) => {
          leadIds.push(lead.id);
        });
        console.log(leadIds);
        //this.checkFilter()
        localStorage.setItem('duplicateleadIds', JSON.stringify(leadIds));
      });
  }

  getDuplicateLeadByEmailAndQuestionId() {
    this.leadService
      .getDuplicateLeadDetailAndQuestionId(
        this.leadDetailObj.emailPlaceId,
        this.leadDetailObj.id
      )
      .then((data: any) => {
        this.rowData = data;
        const leadIds: any[] = [];
        data.forEach((lead: any) => {
          leadIds.push(lead.id);
        });
        console.log(leadIds);
        //this.checkFilter()
        localStorage.setItem('duplicateleadIds', JSON.stringify(leadIds));
      });
  }

  editLeads(id: any) {
    console.log(id);
    this.router.navigate(['/leads/' + id], {
      queryParams: { source: 'leadDetail' }
    });
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.fullName;
    this.modalData.titleName = 'Lead';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.leadService
      .deleteLeadById(id)
      .then(() => {
        this.toastService.success('Lead data deleted successfully');
        if (this.leadDetailObj.emailPlaceId === 'noreply@noreply.com') {
          this.getDuplicateLeadByEmailAndQuestionId();
        } else {
          this.getDuplicateLeadByEmail();
        }
      })
      .catch(() => {
        this.toastService.error('Error while deleting template');
      });
  }

  showSubmission(chatSession: any) {
    const leadIds = JSON.parse(localStorage.getItem('duplicateleadIds'));
    localStorage.setItem('leadIds', JSON.stringify(leadIds));
    this.afteronViewLeadDetail.emit({ from: 'leadDetail' });
    this.router.navigate(['/leads/' + chatSession.id, 'edit'], {
      queryParams: { source: 'leadDetail', email: chatSession?.Email }
    });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
