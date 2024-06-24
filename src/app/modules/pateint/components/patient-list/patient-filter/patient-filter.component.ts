import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../../services/patient.service';

@Component({
  selector: 'app-patient-filter',
  templateUrl: './patient-filter.component.html',
  styleUrls: ['./patient-filter.component.css']
})
export class PatientFilterComponent implements OnInit {
  @Output() patientFilterEmitter = new EventEmitter<any>();
  @Input() totalDataCount: any;
  filterArray: any = [];
  sourceFilterValue: any;
  leadTagFilter: any = null;
  leadTagFilterVal: any = null;
  leadTagsResponse: any = [];
  statusFilter: string;
  isFilterByStatus: boolean;
  filterCount = {
    sourceFilterCount: 0,
    statusFilterCount: 0
  };
  filter: any;
  constructor(
    private alertService: ToasTMessageService,
    private leadService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadLeadTags();
  }

  loadLeadTags() {
    this.leadService
      .patientTagList()
      .then((data: any) => {
        this.leadTagsResponse = data;
      })
      .catch(() => {
        this.alertService.error('Unable to load leads');
      });
  }

  filterByStatus(filter: any) {
    const sourceFilter = this.sourceFilterValue;
    if (filter == 'All') {
      // this.resetFilter()
      this.statusFilter = '';
      this.sourceFilterValue = sourceFilter;
      //this.leadTagFilter = selectedLeadTag;
      // this.filterArray[0]
      if (this.filterArray.length > 1) {
        if (this.filterArray[0]?.filterBy == 'status') {
          this.filterArray.splice(0, 1);
        } else if (
          this.filterArray.length > 0 &&
          this.filterArray[1]?.filterBy == 'status'
        ) {
          this.filterArray.splice(1, 1);
        }
      } else {
        if (this.filterArray[0]?.filterBy == 'status') {
          this.filterArray = [];
          this.isFilterByStatus = false;
        }
      }
      this.filterCount.statusFilterCount = 0;
      this.patientFilterEmitter.emit({
        // sourceFilter: this.sourceFilterValue,
        statusFilter: this.statusFilter,
        selectedLeadTag: this.leadTagFilterVal
      });
    } else if (this.filterArray.length >= 2) {
      this.alertService.warn('Cannot apply more than two filters');
    } else if (this.filterCount.statusFilterCount >= 1) {
      this.alertService.warn(
        'cannot apply more than one filter from same category'
      );
    } else {
      const filterObj = {
        filter: filter,
        filterBy: 'status'
      };
      this.filterCount.statusFilterCount++;
      this.filterArray.push(filterObj);
      this.filter = filter;
      this.isFilterByStatus = true;
      this.statusFilter = filter;
      this.patientFilterEmitter.emit({
        // sourceFilter: this.sourceFilterValue,
        statusFilter: this.statusFilter,
        selectedLeadTag: this.leadTagFilterVal
      });
    }
  }

  // filterBySource(filter: any) {
  //   const statusFilter = this.statusFilter;
  //   console.log(this.leadTagFilter, this.statusFilter, this.filterArray);
  //   if (filter == 'All') {
  //     this.sourceFilterValue = '';
  //     this.statusFilter = statusFilter;
  //     //this.leadTagFilter = selectedLeadTag;
  //     console.log(this.filterArray);
  //     if (this.filterArray.length > 1) {
  //       if (this.filterArray[0]?.filterBy == 'source') {
  //         this.filterArray.splice(0, 1);
  //       } else if (
  //         this.filterArray.length > 0 &&
  //         this.filterArray[1]?.filterBy == 'source'
  //       ) {
  //         this.filterArray.splice(1, 1);
  //       }
  //     } else {
  //       if (this.filterArray[0]?.filterBy == 'source') {
  //         this.filterArray = [];
  //         this.isFilterByStatus = false;
  //       }
  //     }

  //     this.filterCount.sourceFilterCount = 0;
  //     console.log(this.leadTagFilter, this.statusFilter);
  //     this.patientFilterEmitter.emit({
  //       // sourceFilter: this.sourceFilterValue,
  //       statusFilter: this.statusFilter,
  //       selectedLeadTag: this.leadTagFilterVal
  //     });
  //   } else if (this.filterArray.length >= 2) {
  //     this.alertService.warn('Cannot apply more than two filters');
  //   } else if (this.filterCount.sourceFilterCount >= 1) {
  //     this.alertService.warn(
  //       'cannot apply more than one filter from same category'
  //     );
  //   } else {
  //     const filterObj = {
  //       filter: filter,
  //       filterBy: 'source'
  //     };
  //     this.filterArray.push(filterObj);
  //     this.filterCount.sourceFilterCount++;
  //     this.isFilterByStatus = false;
  //     this.filter = filter;
  //     if (filter == 'All') {
  //       this.filter = filter;
  //     }

  //     this.sourceFilterValue = filter;
  //     this.patientFilterEmitter.emit({
  //       // sourceFilter: this.sourceFilterValue,
  //       statusFilter: this.statusFilter,
  //       selectedLeadTag: this.leadTagFilterVal
  //     });
  //   }
  // }

  resetTag() {
    this.leadTagFilter = null;
    this.leadTagFilterVal = null;
    this.patientFilterEmitter.emit({
      // sourceFilter: this.sourceFilterValue,
      statusFilter: this.statusFilter,
      selectedLeadTag: this.leadTagFilter
    });
  }

  onLeadtagChange(event: any) {
    this.leadTagFilterVal = event.name;
    this.patientFilterEmitter.emit({
      // sourceFilter: this.sourceFilterValue,
      statusFilter: this.statusFilter,
      selectedLeadTag: event.name
    });
    console.log('189 on chnge', event.name);
  }

  removeFilter(index: any) {
    this.filterArray.splice(index, 1);
    if (this.filterArray.length == 0) {
      this.statusFilter = '';
      this.sourceFilterValue = '';
      this.filter = '';
      this.isFilterByStatus = false;
      this.filterCount.statusFilterCount = 0;
      this.filterCount.sourceFilterCount = 0;
    } else {
      this.filter = this.filterArray[0].filter;
      if (this.filterArray[0].filterBy == 'status') {
        this.isFilterByStatus = true;
        this.filterCount.sourceFilterCount = 0;
        this.sourceFilterValue = '';
      } else {
        this.statusFilter = '';
        this.filterCount.statusFilterCount = 0;
        this.isFilterByStatus = false;
      }
    }
    this.patientFilterEmitter.emit({
      // sourceFilter: this.sourceFilterValue,
      statusFilter: this.statusFilter,
      selectedLeadTag: this.leadTagFilterVal
    });
  }
}
