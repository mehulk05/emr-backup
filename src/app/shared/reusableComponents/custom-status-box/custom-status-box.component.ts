import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output
} from '@angular/core';

@Component({
  selector: 'app-custom-status-box',
  templateUrl: './custom-status-box.component.html',
  styleUrls: ['./custom-status-box.component.css']
})
export class CustomStatusBoxComponent implements OnChanges {
  @Input() options: any;
  @Input() selected: any;
  allOptions: any;
  @Input() colorMapping: any;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSelectedValue = new EventEmitter<string>();

  constructor(private elementRef: ElementRef) {}

  ngOnChanges() {
    this.allOptions = this.options;
    if (this.options && this.selected) {
      this.allOptions = this.options.filter(
        (option: any) => option.toLowerCase() !== this.selected.toLowerCase()
      );
    }
  }

  selectOption(option: string) {
    this.selected = option;
    this.onSelectedValue.emit(option.toUpperCase());
    this.toggleOptions();
  }

  toggleOptions() {
    const optionsDiv = document.querySelector('.options');
    console.log(optionsDiv);
    optionsDiv?.classList.toggle('show-options');
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const optionsDiv = document.querySelector('.options');
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside && optionsDiv?.classList.contains('show-options')) {
      optionsDiv.classList.remove('show-options');
    }
  }
}
