import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToasTMessageService } from '../../services/toast-message.service';
import { LeadsService } from 'src/app/modules/leads/service/leads.service';
import { PatientService } from 'src/app/modules/pateint/services/patient.service';

@Component({
  selector: 'app-assign-tags',
  templateUrl: './assign-tags.component.html',
  styleUrls: ['./assign-tags.component.css']
})
export class AssignTagsComponent implements OnInit {
  @Input() showLeadTagModal: boolean = false;
  @Output() modalTagClosed = new EventEmitter<any>();
  file: any = null;
  fileName: any;
  recordType = 1;
  selectedTag: any[] = [];
  tagSelect = false;
  tags: any = [];
  @Input() type: any = 'LEAD';

  constructor(
    private alertService: ToasTMessageService,
    private _leadService: LeadsService,
    private _patientService: PatientService
  ) {}

  ngOnInit(): void {
    if (this.type === 'LEAD') {
      this.loadLeadTags();
    }
    if (this.type === 'PATIENT') {
      this.loadPatientsTags();
    }
  }

  loadLeadTags() {
    this._leadService
      .leadTagList()
      .then((data: any) => {
        this.tags = data;
      })
      .catch(() => {
        this.alertService.error('Unable to load leads');
      });
  }

  loadPatientsTags() {
    this._patientService
      .patientTagList()
      .then((data: any) => {
        this.tags = data;
      })
      .catch(() => {
        this.alertService.error('Unable to load leads');
      });
  }

  hideModal(close?: any) {
    if (close === 'submit') {
      this.modalTagClosed.emit({
        close: false,
        selectedTags: this.selectedTag
      });
    } else {
      this.file = null;
      this.modalTagClosed.emit({ close: true });
    }
    this.showLeadTagModal = false;
  }

  onTagSelect(e: any) {
    this.selectedTag = e.value;
    console.log('selected', this.selectedTag);
    if (this.selectedTag.length === 0) {
      this.tagSelect = false;
    } else {
      this.tagSelect = true;
    }
  }
}
