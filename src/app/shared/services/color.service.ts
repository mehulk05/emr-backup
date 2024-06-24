import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  setColors(response: any): void {
    console.log('response', response);
    document.documentElement.style.setProperty(
      '--button-foreground-color',
      response.buttonForegroundColor || '#fff'
    );
    document.documentElement.style.setProperty(
      '--button-background-color',
      response.buttonBackgroundColor || '#003B6F'
    );
    document.documentElement.style.setProperty(
      '--title-color',
      response.titleColor || '#003B6F'
    );
  }
}
