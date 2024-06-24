import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-other-website',
  templateUrl: './other-website.component.html',
  styleUrls: ['./other-website.component.css']
})
export class OtherWebsiteComponent {
  @Input() defaultTemplates: any;
  @Input() link: any;
  @Input() websiteLink: any;
  ssrhost = environment.SSR_DOMAIN;
  websitePageFilter: any;
  @Output() selectThemeEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();

  constructor(private router: Router) {}

  editPage(id: any) {
    this.router.navigate(['website', id, 'edit']);
  }

  selectTheme(landingPage: any, bgColor: any, fgColor: any, titleColor: any) {
    const selectThemeObj = {
      landingPage: landingPage,
      bgColor: bgColor,
      fgColor: fgColor,
      titleColor: titleColor,
      checkboxEvent: false
    };
    this.selectThemeEvent.next(selectThemeObj);
  }

  public updateWebsite(id: any) {
    console.log(id);
    const obj = {
      id: id,
      checkboxEvent: true
    };
    this.selectThemeEvent.next(obj);
  }

  delete(id: any) {
    this.deleteEvent.emit({ id: id });
  }
}
