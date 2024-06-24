import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MediaTagService } from 'src/app/modules/social-media-manager/services/media-tag.service';
import { MedialibraryService } from 'src/app/modules/social-media-manager/services/medialibrary.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { PostLibraryService } from '../../../services/post-library.service';

@Component({
  selector: 'app-select-image-library',
  templateUrl: './select-image-library.component.html',
  styleUrls: ['./select-image-library.component.css']
})
export class SelectImageLibraryComponent implements OnInit {
  @Input() showModalForImage: boolean = true;
  @Output() afterImageSelection = new EventEmitter<any>();

  pageSearchFilter: any = '';

  selectedIndex: any = 0;
  sources = ['myWebsite', 'Libary'];
  source: any = 'myWebsite';
  websiteLink: any;
  landingPageLibraryLink: any;
  modifiedTemplates: any = [];
  libraries: any = [];
  libraryTemplates: any = [];
  landingPages: any;

  ssrDomain = environment.SSR_DOMAIN;
  loggedInUser: any;
  domain: any = environment.OLD_EMR_DOMAIN;
  link: any = null;
  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 10, //rows,
    recordArray: [10, 20, 25, 30, 50],
    currentRecordIndex: 1,
    count: 0
  };
  totalDataCount: any = 0;
  totalDataCustomCount: any = 0;
  previwThumbnailLink: string;
  mediaTags: any[] = [];
  selectedTag: any = '';

  constructor(
    private router: Router,
    private medialibraryService: MedialibraryService,
    private alertService: ToasTMessageService,
    private socialMediaService: PostLibraryService,
    private _location: Location,
    private mediaTagService: MediaTagService
  ) {}

  ngOnInit(): void {
    this.getLibraries(
      this.pageSearchFilter,
      '',
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
    this.getTagList();
  }

  getLibraries(search: string, tag: any, page?: number, size?: number) {
    this.medialibraryService.getLibraries(search, tag, page, size).then(
      (response: any) => {
        this.libraries = response.content;
        this.paginatorConfig.totalPage = response.totalPages;
        this.paginatorConfig.count = response.totalElements;
      },
      () => {
        this.alertService.error('Unable to load library images.');
      }
    );
  }

  addNewLibrary() {
    this.router.navigate(['media/library/add']);
  }

  refreshPage(e: any) {
    console.log(e);
    this.getLibraries(
      this.pageSearchFilter,
      this.selectedTag,
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
  }

  paginate(event: any) {
    console.log(event);
    this.paginatorConfig.currentPage = event.page;
    this.paginatorConfig.noOfRecord = event.rows;
    this.paginatorConfig.currentRecordIndex = event.first;
    this.getLibraries(
      this.pageSearchFilter,
      this.selectedTag,
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
  }

  getTagList() {
    this.mediaTagService
      .socialMediaTagList()
      .then((data: any) => {
        this.mediaTags = data.sort((a: any, b: any) => (a.id > b.id ? -1 : 1));
      })
      .catch(() => {
        this.alertService.error('Unable to load Media Tags');
      });
  }

  reset() {
    this.pageSearchFilter = '';
    this.selectedTag = '';
    this.getLibraries(
      this.pageSearchFilter,
      this.selectedTag,
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
  }

  selectPage(data: any) {
    this.showModalForImage = false;
    this.afterImageSelection.emit(data);
  }

  searchPage() {
    this.getLibraries(
      this.pageSearchFilter,
      this.selectedTag,
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
  }

  cancelModel() {
    this.showModalForImage = false;
    this.afterImageSelection.emit(null);
  }

  getTags(tag: any) {
    return tag?.map((response: any) => {
      return response?.libraryTag?.name;
    });
  }

  onTagSelected() {
    this.getLibraries(
      this.pageSearchFilter,
      this.selectedTag,
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
  }
}
