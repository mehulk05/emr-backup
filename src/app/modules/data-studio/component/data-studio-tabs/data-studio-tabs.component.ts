import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'src/app/shared/services/sidebar-menu.service';

@Component({
  selector: 'app-data-studio-tabs',
  templateUrl: './data-studio-tabs.component.html',
  styleUrls: ['./data-studio-tabs.component.css']
})
export class DataStudioTabsComponent implements OnInit, OnDestroy {
  selectedIndex: any;
  sources = [
    'data-studio',
    'paid-media',
    'leads',
    'appointments',
    'syndication-reports',
    'seo-reports'
  ];
  source: any = 'data-studio';
  breadCrumb = [
    'Data Studio Report',
    'Paid Media Report',
    'Leads Report',
    'Appointment Report',
    'Syndication Report',
    'Seo Report'
  ];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: MenuService
  ) {}

  ngOnInit(): void {
    this.source =
      this.activatedRoute.snapshot.queryParams?.source ?? 'data-studio';
    if (this.source) {
      this.selectedIndex = this.sources.indexOf(this.source);
    }

    this.activatedRoute.queryParams.subscribe((data) => {
      this.source = data?.source ?? 'data-studio';
      this.selectedIndex = this.sources.indexOf(this.source);
      this.authService.breadCrumbFromComponent.next(
        this.breadCrumb[this.selectedIndex]
      );
    });
  }

  ngOnDestroy(): void {
    this.authService.breadCrumbFromComponent.next(null);
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['datastudio'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }
}
