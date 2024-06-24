import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientTagService } from '../../services/patient-tag.service';

@Component({
  selector: 'app-patient-tags-list',
  templateUrl: './patient-tags-list.component.html',
  styleUrls: ['./patient-tags-list.component.css']
})
export class PatientTagsListComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 50;
  globalFilterColumn = ['id', 'name'];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];

  constructor(
    private patientTagService: PatientTagService,
    private toastService: ToasTMessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadPatientTags();
  }

  loadPatientTags() {
    this.patientTagService
      .patientTagList()
      .then((data: any) => {
        this.rowData = data.sort((a: any, b: any) => (a.id > b.id ? -1 : 1));
        // console.log(this.rowData.sort((a, b) => (a.id > b.id ? -1 : 1)));
      })
      .catch(() => {
        this.toastService.error('Unable to load patients');
      });
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Patient Tag';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.patientTagService
      .deleteTagById(id)
      .then(() => {
        this.loadPatientTags();
        this.toastService.success('Tag deleted successfully');
      })
      .catch(() => {
        this.toastService.error(
          'The Tag Associated With A Patient Cannot Be Deleted. To Delete, Remove This Tag From The Patients'
        );
      });
  }
  editTemplate(id: any) {
    this.router.navigate(['/ptag', 'edit', id]);
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
