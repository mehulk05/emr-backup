import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  ActionEventArgs,
  AgendaService,
  DayService,
  DragAndDropService,
  EventSettingsModel,
  ICalendarExportService,
  ICalendarImportService,
  MonthService,
  PopupOpenEventArgs,
  ResizeService,
  ScheduleComponent,
  WeekService,
  WorkWeekService
} from '@syncfusion/ej2-angular-schedule';
import { L10n } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import moment from 'moment';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PostLibraryService } from '../../services/post-library.service';

L10n.load({
  'en-US': {
    schedule: {
      newEvent: 'Add Post',
      editEvent: 'Edit Post'
    }
  }
});
@Component({
  selector: 'app-post-calendar',
  templateUrl: './post-calendar.component.html',
  styleUrls: ['./post-calendar.component.css'],
  providers: [
    DayService,
    WeekService,
    ICalendarExportService,
    ICalendarImportService,
    WorkWeekService,
    MonthService,
    AgendaService,
    ResizeService,
    DragAndDropService
  ]
})
export class PostCalendarComponent implements OnInit {
  posts: any = [];
  events: any[] = [];
  public eventSettings: EventSettingsModel;
  @ViewChild('scheduleObj')
  public scheduleObj!: ScheduleComponent;

  calendarArgs: any;
  formTitle!: string;
  showModal = false;
  isMobileDevice: boolean = false;
  constructor(
    private alertService: ToasTMessageService,
    private socialMediaService: PostLibraryService
  ) {}

  ngOnInit(): void {
    this.loadSocialMediaPosts();
    this.onResize();
  }

  loadSocialMediaPosts() {
    console.log('call');
    this.socialMediaService.postList().then(
      (response: any) => {
        this.posts = response;
        this.createCalenderEvents();
      },
      () => {
        this.alertService.error('Error loading posts !!');
      }
    );
  }

  createCalenderEvents() {
    const events: any = [];
    console.log(this.posts);
    this.posts.map((post: any) => {
      console.log(post, moment(post.scheduledDate).toDate());
      events.push({
        Id: post.id.toString(),
        Subject: post.post,
        CategoryColor: '#1E90FF',
        StartTime: moment(post.scheduledDate).toDate(),
        EndTime: moment(post.scheduledDate).add(1, 'hours').toDate()
        //Post: post
      });
    });

    this.events = events;
    this.eventSettings = {
      dataSource: <Object[]>extend([], events, null, true)
    };
  }

  // public onPopupOpen(args: PopupOpenEventArgs): void {
  //   console.log(args);
  //   this.showModal = true;
  //   if (args.type === 'Editor' || args.type === 'QuickInfo') {
  //     args.cancel = true;
  //   }
  //   this.calendarArgs = args;
  // }
  public onPopupOpen(args: PopupOpenEventArgs): void {
    console.log(args);
    if (args.type === 'Editor' || args.type === 'QuickInfo') {
      this.showModal = true;
      this.calendarArgs = args;
      args.cancel = true;
    }
  }

  onActionComplete(args: ActionEventArgs): void {
    if (args && args.requestType && args.requestType === 'eventCreated') {
      //  this.submitPopForm();
    }
  }

  onModalClosed(e: any) {
    console.log('e', e);
    this.loadSocialMediaPosts();
    this.showModal = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 768) {
      this.isMobileDevice = true;
    } else {
      this.isMobileDevice = false;
    }
  }

  onAddPostFromMobile(e: any) {
    this.showModal = true;
    if (e.mode == 'edit') {
      this.calendarArgs = { data: { Id: e?.data.id } };
    }
    console.log(e);
  }
}
