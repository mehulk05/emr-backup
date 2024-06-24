import { KeyValue } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';

@Component({
  selector: 'app-post-calendar-mobile-view',
  templateUrl: './post-calendar-mobile-view.component.html',
  styleUrls: ['./post-calendar-mobile-view.component.css']
})
export class PostCalendarMobileViewComponent implements OnChanges {
  @Input() posts: any;
  upcomingPosts: any;
  groupedUpComingPostsObj: any;
  @Output() emitShowModal = new EventEmitter<any>();
  constructor(private formatTimeService: FormatTimeService) {}

  ngOnChanges(): void {
    if (this.posts?.length > 0) {
      this.getNewPosts();
    }
  }

  getNewPosts() {
    const newDate = new Date();
    const result = this.posts.filter((data: any) => {
      const currentDate = new Date(data.scheduledDate);
      if (currentDate >= newDate) {
        return data;
      }
    });
    this.upcomingPosts = result;
    this.groupAppointmentsByDate();
  }

  getPastPosts() {
    const newDate = new Date();
    const result = this.posts.filter((data: any) => {
      const currentDate = new Date(data.scheduledDate);
      if (currentDate < newDate) {
        return data;
      }
    });
    this.upcomingPosts = result;
    this.groupAppointmentsByDate();
  }

  getAllPosts() {
    this.upcomingPosts = this.posts;
    this.groupAppointmentsByDate();
  }

  groupAppointmentsByDate() {
    const groups = this.upcomingPosts.reduce((groups: any, game: any) => {
      console.log(game.scheduledDate);
      const date = game.scheduledDate.split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(game);
      return groups;
    }, {});
    this.groupedUpComingPostsObj = groups;
    console.log(groups);
  }

  keyDescOrder = (a: KeyValue<any, any>, b: KeyValue<any, any>): number => {
    return a.key < b.key ? -1 : b.key > a.key ? 1 : 0;
  };

  isEmptyObject(obj: any) {
    return obj && Object.keys(obj).length === 0;
  }
  onDateSelect(e: any) {
    console.log(e);
  }

  addPost() {
    this.emitShowModal.emit({ mode: 'add', data: null });
  }

  editPost(Post: any) {
    this.emitShowModal.emit({ mode: 'edit', data: Post });
  }

  formatTime(time: any) {
    return this.formatTimeService.formatBookingHistoryTime(time);
  }

  handleChange(e: any) {
    if (e.index == 0) {
      this.getNewPosts();
    } else if (e.index == 1) {
      this.getPastPosts();
    } else {
      this.getAllPosts();
    }
  }
}
