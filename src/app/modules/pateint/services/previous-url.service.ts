import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreviousUrlService {
  private previousUrl: string | null = '/';

  constructor() {}

  setPreviousUrl(url: string): void {
    this.previousUrl = url;
  }

  getPreviousUrl(): string | null {
    return this.previousUrl;
  }

  resetPreviousUrl(): void {
    this.previousUrl = null;
  }
}
