import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-consent-container',
  templateUrl: './consent-container.component.html',
  styleUrls: ['./consent-container.component.css']
})
export class ConsentContainerComponent implements OnInit {
  selectedIndex: any = 0;
  sources = ['myConsent', 'otherConsent'];
  source: any = 'myConsent';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.source =
      this.activatedRoute.snapshot.queryParams?.source ?? 'myConsent';
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data?.source ?? 'myConsent';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
    });
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['clinical-doc/consents'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }
}
