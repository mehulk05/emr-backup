import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  @Input() size: number = 20; // Default size
  @Input() textSize: number = 16; // Default text size
  @Input() text: string = ''; // Default empty text
  @Input() color: string = '#000'; // Default loader color
  @Input() alignment: 'horizontal' | 'vertical' = 'horizontal'; // Default alignment

  getLoaderStyles() {
    return {
      'width.px': this.size,
      'height.px': this.size,
      border: '3px solid ' + this.color,
      'border-right-color': 'transparent'
    };
  }
}
