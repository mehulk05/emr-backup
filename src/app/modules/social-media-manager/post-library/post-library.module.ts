import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostLibraryRoutingModule } from './post-library-routing.module';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostCalendarComponent } from './components/post-calendar/post-calendar.component';
import { AddEditPostComponent } from './components/add-edit-post/add-edit-post.component';
import { SocialProfilesComponent } from './components/social-profiles/social-profiles.component';
import { FormsModule } from '@angular/forms';
import { NgPrimeModule } from '../../ng-prime/ng-prime.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddEditSocialProfileComponent } from './components/add-edit-social-profile/add-edit-social-profile.component';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { ImageCropperModule } from 'ngx-image-cropper';
import { PostCalendarMobileViewComponent } from './components/post-calendar/post-calendar-mobile-view/post-calendar-mobile-view.component';
import { AddEditCalendarPostComponent } from './components/post-calendar/add-edit-calendar-post/add-edit-calendar-post.component';
import { FacebookCallbackComponent } from './components/facebook-callback/facebook-callback.component';
import { LinkedinCallbackComponent } from './components/linkedin-callback/linkedin-callback.component';
import { SelectImageLibraryComponent } from './components/post-calendar/select-image-library/select-image-library.component';
import { ConfigureAiPostComponent } from './components/configure-ai-post/configure-ai-post.component';

@NgModule({
  declarations: [
    PostListComponent,
    PostCalendarComponent,
    AddEditPostComponent,
    SocialProfilesComponent,
    AddEditSocialProfileComponent,
    AddEditCalendarPostComponent,
    PostCalendarMobileViewComponent,
    FacebookCallbackComponent,
    LinkedinCallbackComponent,
    SelectImageLibraryComponent,
    ConfigureAiPostComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule,
    PostLibraryRoutingModule,
    FormsModule,
    NgPrimeModule,
    ScheduleModule,
    SharedModule,
    ImageCropperModule
  ]
})
export class PostLibraryModule {}
