import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PostLibraryService } from '../../services/post-library.service';

@Component({
  selector: 'app-linkedin-callback',
  templateUrl: './linkedin-callback.component.html',
  styleUrls: ['./linkedin-callback.component.css']
})
export class LinkedinCallbackComponent implements OnInit {
  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToasTMessageService,
    private socialProfileService: PostLibraryService
  ) {}

  ngOnInit(): void {
    const code = this.activateRoute.snapshot.queryParams['code'];
    //console.log("code", code);
    this.createSocialProfile(code, 'Linkedin');
  }

  createSocialProfile(accessToken: any, socialChannel: any) {
    const formData = {
      accessToken: accessToken,
      socialChannel: socialChannel
    };
    this.socialProfileService.createSocialProfile(formData).then(
      () => {
        this.router.navigate(['/post-library/profiles']);
      },
      () => {
        this.toastService.error('Unable to create social profile.');
      }
    );
  }
}
