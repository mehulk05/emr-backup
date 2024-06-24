import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-view-tags',
  templateUrl: './view-tags.component.html',
  styleUrls: ['./view-tags.component.css']
})
export class ViewTagsComponent  {

  @Input() tagsData: any;
  @Input() showTagsData: boolean = false;

  @Output() afterTagsModalClose = new EventEmitter<any>();

  constructor() { }


  closeModal(){
    this.afterTagsModalClose.emit({type : 'close'})
  }
}
