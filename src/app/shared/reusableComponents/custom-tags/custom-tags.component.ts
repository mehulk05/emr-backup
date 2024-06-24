import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-custom-tags',
  templateUrl: './custom-tags.component.html',
  styleUrls: ['./custom-tags.component.css']
})
export class CustomTagsComponent implements OnInit, OnDestroy {
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('input') input!: ElementRef;
  @Output() selectedItemsChange = new EventEmitter<string[]>();

  @Input() items: any[];

  @Input() validationExpression: any;

  selectedItems: any[] = [];

  @Input() set selectedValue(value: any) {
    console.log(value);
    const filteredArray = value.filter((item: any) => item.name !== '');

    this.selectedItems = filteredArray;
  }
  selectedItem: string = '';
  isDropdownOpen: boolean = false;

  ngOnInit() {
    // Add click event listener to the document
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    // Remove click event listener when component is destroyed
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: MouseEvent) {
    // Get the target element of the click event
    const target = event.target as HTMLElement;

    // Check if the click target is within the dropdown or input element
    const isTargetInDropdown = this.isDescendant(
      target,
      this.dropdownMenu.nativeElement
    );
    const isTargetInInput = this.isDescendant(target, this.input.nativeElement);

    if (!isTargetInDropdown && !isTargetInInput) {
      // Click is outside dropdown and input, close the dropdown
      this.isDropdownOpen = false;
    }
  }

  isDescendant(child: HTMLElement, parent: HTMLElement) {
    let node = child.parentNode;

    while (node != null) {
      if (node == parent) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  }

  onInputKeyDown(event: KeyboardEvent) {
    this.isDropdownOpen = true;
    if (event.key === 'Enter' && this.selectedItem.trim() !== '') {
      const lowerCaseSelectedItem = this.selectedItem.toLowerCase();
      const selectedItem = { id: this.selectedItem, name: this.selectedItem };
      if (
        !this.selectedItems.find(
          (selectedItem) =>
            selectedItem.name.toLowerCase() === lowerCaseSelectedItem
        )
      ) {
        this.selectedItems.push(selectedItem);
        this.items = this.items.filter((item) => item.id !== selectedItem.id);
        this.isDropdownOpen = false;
        this.selectedItemsChange.emit(this.selectedItems);
      }
      this.selectedItem = '';
    }
  }

  onItemSelect(item: { id: number; name: string }) {
    this.selectedItems.push(item);
    this.items = this.items.filter((i) => i.id !== item.id);
    this.selectedItem = '';
    this.isDropdownOpen = false;
    this.selectedItemsChange.emit(this.selectedItems);
  }

  onChipClick(chip: { id: number; name: string }) {
    const index = this.selectedItems.findIndex(
      (c) => c.name.toLowerCase() === chip.name.toLowerCase()
    );
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
    }
    this.selectedItemsChange.emit(this.selectedItems);
  }

  onInputChanged(event: Event) {
    this.selectedItem = (event.target as HTMLInputElement).value;
  }

  get filteredItems() {
    const lowerCaseSelectedItem = this.selectedItem.toLowerCase();
    return this.items.filter((item) => {
      const lowerCaseItem = item.name.toLowerCase();
      return (
        !this.selectedItems.find(
          (selectedItem) => selectedItem.name.toLowerCase() === lowerCaseItem
        ) && lowerCaseItem.includes(lowerCaseSelectedItem)
      );
    });
  }

  onAddItemClick() {
    console.log(this.selectedItem);
    const lowerCaseSelectedItem = this.selectedItem.toLowerCase();
    const selectedItem = { id: this.selectedItem, name: this.selectedItem };

    if (
      lowerCaseSelectedItem.trim() !== '' &&
      !this.selectedItems.find(
        (selectedItem) =>
          selectedItem.name.toLowerCase() === lowerCaseSelectedItem
      )
    ) {
      this.selectedItems.push(selectedItem);
      this.selectedItem = '';
      this.isDropdownOpen = false;
      this.selectedItemsChange.emit(this.selectedItems);
    }
  }

  checkIfItemExist(itemsArray: any[], item: any, key: string) {
    item = item.toLowerCase().trim();
    return itemsArray.find((item: any) => item[key].toLowerCase() === item);
  }

  get isValid(): boolean {
    if (!this.validationExpression || !this.selectedItem) {
      return true; // No validation expression provided, so it's always valid
    }

    return this.validationExpression?.test(this.selectedItem);
  }
}
