import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { AddEditPostComponent } from './components/add-edit-post/add-edit-post.component';
import { AddEditSocialProfileComponent } from './components/add-edit-social-profile/add-edit-social-profile.component';
import { FacebookCallbackComponent } from './components/facebook-callback/facebook-callback.component';
import { LinkedinCallbackComponent } from './components/linkedin-callback/linkedin-callback.component';
import { PostCalendarComponent } from './components/post-calendar/post-calendar.component';
import { SelectImageLibraryComponent } from './components/post-calendar/select-image-library/select-image-library.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { SocialProfilesComponent } from './components/social-profiles/social-profiles.component';
import { ConfigureAiPostComponent } from './components/configure-ai-post/configure-ai-post.component';

const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Posts List'
    }
  },
  {
    path: 'add',
    component: AddEditPostComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Add Post'
    }
  },
  {
    path: ':id/edit',
    component: AddEditPostComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Post'
    }
  },
  {
    path: 'profiles',
    component: SocialProfilesComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Social Profiles'
    }
  },
  {
    path: 'profiles/:id/edit',
    component: AddEditSocialProfileComponent,
    data: {
      breadcrumb: 'Edit Social Profile'
    }
  },
  {
    path: 'facebook/callback',
    component: FacebookCallbackComponent
  },
  {
    path: 'linkedin/callback',
    component: LinkedinCallbackComponent
  },
  {
    path: 'calendar',
    component: PostCalendarComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Post Calendar'
    }
  },
  {
    path: 'library',
    component: SelectImageLibraryComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'library'
    }
  },
  {
    path: 'al-config',
    component: ConfigureAiPostComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'AI-configuration'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostLibraryRoutingModule {}
