import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-user-tabs',
  templateUrl: './user-tabs.component.html',
  styleUrls: ['./user-tabs.component.css']
})
export class UserTabsComponent implements OnInit {
  userId: any;
  selectedIndex: any = 0;
  showChangePassword: any = false;
  sources = [
    'profile',
    'appointments',
    'working',
    'vacation',
    'change-password'
  ];
  source: any = 'profile';
  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorgaeService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.params.userId;
    this.source = this.activatedRoute.snapshot.queryParams?.source ?? 'profile';
    // const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const currentUser = this.localStorgaeService.readStorage('currentUser');

    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data?.source ?? 'profile';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
    });
    this.activatedRoute.params.subscribe((data: any) => {
      this.userId = data?.userId;
    });

    if (currentUser != null && !currentUser.supportUser) {
      if (this.userId) {
        if (this.userId == currentUser.id) {
          this.showChangePassword = true;
        }
      } else {
        this.showChangePassword = true;
      }
    }
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    if (this.userId) {
      this.router.navigate(['users', this.userId, 'edit'], {
        queryParams: {
          source: this.sources[e.index]
        },
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate(['users', 'profile'], {
        queryParams: {
          source: this.sources[e.index]
        },
        queryParamsHandling: 'merge'
      });
    }
  }
}
