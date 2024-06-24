import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { environment } from 'src/environments/environment';
import { PostLibraryService } from '../../services/post-library.service';

@Component({
  selector: 'app-social-profiles',
  templateUrl: './social-profiles.component.html',
  styleUrls: ['./social-profiles.component.css']
})
export class SocialProfilesComponent implements OnInit {
  first = 0;
  rows = 50;

  showModal: boolean = false;
  modalData: any;

  globalFilterColumn = ['id', 'name', 'socialChannel'];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Social Channel', field: 'socialChannel' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];

  constructor(
    private postLibraryService: PostLibraryService,
    public formatTimeService: FormatTimeService,
    private toastService: ToasTMessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadSocialProfiles();
  }

  loadSocialProfiles() {
    this.postLibraryService
      .getSocialPProfiles()
      .then((data: any) => {
        this.rowData = data;
      })
      .catch(() => {
        this.toastService.error('Unable to load leads');
      });
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Social Profile';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.postLibraryService
      .deleteSocialProfile(id)
      .then(() => {
        this.toastService.success('Social Profile deleted successfully');
        this.loadSocialProfiles();
      })
      .catch(() => {
        this.toastService.error('Error while deleting template');
      });
  }

  editTemplate(id: any) {
    this.router.navigate(['/post-library/profiles', id, 'edit']);
  }

  createProfile(type: any) {
    if (type == 'fb') {
      // window.top.location.href = environment.FACEBOOK_CONNECT_URL;
      window.open(environment.FACEBOOK_CONNECT_URL, '_blank');
    } else if (type == 'instagram') {
      // window.top.location.href = environment.INSTAGRAM_CONNECT_URL;
      window.open(environment.INSTAGRAM_CONNECT_URL, '_blank');
    } else if (type == 'linkedin') {
      window.open(environment.LINKEDIN_CONNECT_URL, '_blank');
    }
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
