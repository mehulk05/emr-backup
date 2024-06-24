import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-import-export-center',
  templateUrl: './import-export-center.component.html',
  styleUrls: ['./import-export-center.component.css']
})
export class ImportExportCenterComponent implements OnInit {
  selectedIndex: any;
  sources = ['leads', 'patient', 'triggers'];
  source: any = 'leads';
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data?.source ?? 'leads';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
    });
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['importExportCenter'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }
}
