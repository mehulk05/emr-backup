import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-landing-page-grid',
  templateUrl: './landing-page-grid.component.html',
  styleUrls: ['./landing-page-grid.component.css']
})
export class LandingPageGridComponent implements OnInit {
  @Input() previwThumbnailLink: any;
  @Input() defaultTemplates: any;
  @Input() link: any;
  @Input() bid: any;
  @Input() websiteLink: any;
  @Input() landingPageLibraryLink: any;
  @Input() isEditDisabled: boolean;
  @Input() isDeleteDisabled: boolean;
  @Input() isPublic = false;
  //websiteLink: any = environment.SSR_DOMAIN;
  oldDomain = environment.OLD_EMR_DOMAIN;
  landingPageFilter: any = '';
  showModal: boolean = false;
  modalData: any;
  @Output() emitPageEvent = new EventEmitter<any>();
  currentSource: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {}

  editPage(id: any) {
    if (!this.isEditDisabled) {
      console.log('id', id);
      this.emitPageEvent.emit({ eventType: 'EDIT', data: id });
    }

    // this.router.navigate(['landingpage', id, 'edit']);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data) => {
      console.log('data', data);
      this.currentSource = data?.source;
    });
  }

  addLandingPage() {
    this.emitPageEvent.emit({ eventType: 'CREATE' });
    // this.router.navigate(['landingpage/create']);
  }

  replaceSpecialCharacter(name: any) {
    // var name1 = name.replace(/[^a-zA-Z0-9_-]+/g, '');
    var name1 = name ? name.replace(/[^a-zA-Z0-9_-]+/g, '') : name;
    //console.log(name1)
    return name1;
  }

  deleteTrash(data: any) {
    console.log('id', data);
    this.emitPageEvent.emit({ eventType: 'DELETE', data: data });
  }

  previewPage(page: any) {
    const currentUser = this.localStorageService.readStorage('currentUser');
    let url;
    if (currentUser && currentUser?.idToken) {
      url =
        this.websiteLink +
        '/landingpage1/' +
        page.id +
        '?token=' +
        currentUser.idToken;
    } else {
      url = this.websiteLink + '/landingpage/' + page.id;
    }
    // const url = this.currentSource !== 'Libary' ?
    //   this.websiteLink + '/service/' + this.replaceSpecialCharacter(page.name) : this.websiteLink +  '/landingpage1/' + page.id + '?token='+ currentUser.idToken;
    //

    window.open(url, '_blank');
  }

  useTemplate(page: any) {
    const url =
      this.websiteLink + '/service/' + this.replaceSpecialCharacter(page.name);
    this.emitPageEvent.emit({
      eventType: 'USE',
      data: { page: page, previewUrl: url }
    });
  }
}
