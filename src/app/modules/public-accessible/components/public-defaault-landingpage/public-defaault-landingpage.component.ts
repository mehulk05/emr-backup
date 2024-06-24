import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-public-defaault-landingpage',
  templateUrl: './public-defaault-landingpage.component.html',
  styleUrls: ['./public-defaault-landingpage.component.css']
})
export class PublicDefaaultLandingpageComponent {
  @Input() defaultTemplates: any;
  @Input() link: any;
  @Input() bid: any;
  @Input() websiteLink: any;
  @Input() previwThumbnailLink: string;
  @Input() isPublic = true;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onPageUpdate = new EventEmitter<any>();

  ssrhost = environment.SSR_DOMAIN;
  oldDomain = environment.OLD_EMR_DOMAIN;
  landingPageFilter: any = '';
  constructor() {}

  replaceSpecialCharacter(name: any) {
    var name1 = name ? name.replace(/[^a-zA-Z0-9_-]+/g, '') : name;
    //console.log(name1)
    return name1;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEventFromTable(e: any) {
    return;
  }

  searchPage() {
    this.onPageUpdate.emit({ searchText: this.landingPageFilter });
  }
}
