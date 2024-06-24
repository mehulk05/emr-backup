import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PostLibraryService } from '../../services/post-library.service';

@Component({
  selector: 'app-facebook-callback',
  templateUrl: './facebook-callback.component.html',
  styleUrls: ['./facebook-callback.component.css']
})
export class FacebookCallbackComponent implements OnInit {
  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToasTMessageService,
    private socialProfileService: PostLibraryService
  ) {}

  ngOnInit(): void {
    this.activateRoute.fragment.subscribe((fragment) => {
      const urlParams = new URLSearchParams(fragment);
      const error = urlParams.get('error');
      if (error != null) {
        // show error
      } else {
        //console.log("urlParams", urlParams.get("access_token"));
        const state = urlParams.get('state');
        const values = state.split('_');
        let channel = 'Facebook';
        if (values.length > 1) {
          channel = values[1];
        }
        this.createSocialProfile(urlParams.get('access_token'), channel);
      }
    });
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
