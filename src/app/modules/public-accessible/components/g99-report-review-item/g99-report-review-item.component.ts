import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-g99-report-review-item',
  templateUrl: './g99-report-review-item.component.html',
  styleUrls: ['./g99-report-review-item.component.css']
})
export class G99ReportReviewItemComponent implements OnInit {
  @Input() review: any;
  rating: string = 'rating 5';
  stars: number[];
  constructor() {}

  ngOnInit(): void {
    // if (this.review?.ratings) {
    //   this.rating = this.review.ratings;
    // }
    // this.stars = [...Array(parseInt(this.rating.split(' ')[1])).keys()];
    this.rating = this.review.ratings;
    try {
      this.stars = [...Array(parseInt(this.rating)).keys()];
      console.log(this.stars);
    } catch (err) {
      if (this.review?.handleName == 'yelp') {
        this.stars = [...Array(parseInt(this.rating.split(' ')[0])).keys()];
      } else {
        this.stars = [...Array(parseInt(this.rating.split(' ')[1])).keys()];
      }
    }
  }
}
