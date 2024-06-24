import { Component, OnInit } from '@angular/core';
import { Observable, interval, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-internet-banner',
  templateUrl: './internet-banner.component.html',
  styleUrls: ['./internet-banner.component.css']
})
export class InternetBannerComponent implements OnInit {
  isOnline$: Observable<boolean>;
  isWeakConnection = false;
  bannerText: string;
  private destroy$ = new Subject<void>();
  isOnline: boolean;

  ngOnInit() {
    this.isOnline$ = interval(1000).pipe(
      map(() => navigator.onLine),
      takeUntil(this.destroy$)
    );

    this.isOnline$.subscribe((isOnline) => {
      console.log('isOnline', isOnline);

      this.isOnline = isOnline;
      if (!isOnline) {
        this.isWeakConnection = false;
        this.bannerText = 'You are offline';
      } else {
        this.checkWeakConnection();
      }
    });
  }

  checkWeakConnection() {
    // Implement your logic to check for weak connection (e.g., slow response time)
    // For simplicity, let's assume a threshold of 300 milliseconds for demonstration purposes
    const threshold = 300;

    const startTime = new Date().getTime();
    fetch('https://www.example.com').then(() => {
      const endTime = new Date().getTime();
      const responseTime = endTime - startTime;

      this.isWeakConnection = responseTime > threshold;
      this.bannerText = 'Weak Internet Connection';
    });
  }

  closeBanner() {
    this.destroy$.next();
    this.isOnline = true;
    this.isWeakConnection = false;
  }
}
