import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PostLibraryService } from '../../services/post-library.service';

@Component({
  selector: 'app-add-edit-social-profile',
  templateUrl: './add-edit-social-profile.component.html',
  styleUrls: ['./add-edit-social-profile.component.css']
})
export class AddEditSocialProfileComponent implements OnInit {
  socialProfileForm: FormGroup;
  id: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private socialMediaService: PostLibraryService
  ) {}

  ngOnInit(): void {
    console.log('');
    this.socialProfileForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    });

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      if (this.id) {
        this.loadSocialProfile();
      }
    });
  }

  loadSocialProfile() {
    this.socialMediaService.getSocialProfile(this.id).then((response: any) => {
      this.socialProfileForm.patchValue(response);
    });
  }

  get f() {
    return this.socialProfileForm.controls;
  }

  submitForm() {
    if (this.socialProfileForm.invalid) {
      return;
    }

    const formData = this.socialProfileForm.value;

    if (this.id) {
      this.socialMediaService.updateSocialProfile(this.id, formData).then(
        () => {
          this.alertService.success(
            'Social profile channel updated successfully.'
          );
          this.goBack();
        },
        (error) => {
          this.alertService.error(error.message);
        }
      );
    } else {
      this.socialMediaService.create(formData).then(
        () => {
          this.alertService.success('Social media post created successfully.');
          this.goBack();
        },
        (error) => {
          this.alertService.error(error.message);
        }
      );
    }
  }
  goBack() {
    this.router.navigate(['/post-library/profiles']);
  }
}
