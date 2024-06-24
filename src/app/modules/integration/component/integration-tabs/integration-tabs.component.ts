import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/shared/services/sidebar-menu.service';

@Component({
  selector: 'app-integration-tabs',
  templateUrl: './integration-tabs.component.html',
  styleUrls: ['./integration-tabs.component.css']
})
export class IntegrationTabsComponent implements OnInit, OnDestroy {
  selectedIndex: any;
  sources = ['single-script', 'component-integration'];
  breadCrumb = ['Cliff Hanger', 'Component Integration'];
  source: any = 'single-script';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: MenuService
  ) {}
  ngOnDestroy(): void {
    this.authService.breadCrumbFromComponent.next(null);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data) => {
      this.source = data?.source ?? 'single-script';
      this.selectedIndex = this.sources.indexOf(this.source);
      this.authService.breadCrumbFromComponent.next(
        this.breadCrumb[this.selectedIndex]
      );
    });
    if (this.source) {
      this.selectedIndex = this.sources.indexOf(this.source);
      this.authService.breadCrumbFromComponent.next(
        this.breadCrumb[this.selectedIndex]
      );
    }
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['integration'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }
}
