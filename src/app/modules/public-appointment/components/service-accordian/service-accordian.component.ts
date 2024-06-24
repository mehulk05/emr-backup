import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryService } from 'src/app/modules/account-and-settings/service-category/services/category.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-service-accordian',
  templateUrl: './service-accordian.component.html',
  styleUrls: ['./service-accordian.component.css']
})
export class ServiceAccordianComponent {
  @Output() selectedServiceIdCheck = new EventEmitter<any>();
  @Input() activeLinkStyle: any;
  @Input() buttonForegroundColor: any;
  @Input() titleColor: any;
  @Input() currency: any;
  @Input() buttonBackgroundColor: any;
  @Input() booking: any;
  @Input() showRadio: boolean;
  @Output() selectedServiceEmitter = new EventEmitter<any>();

  serviceList: Service[];
  servicesByCategory: ServicesByCategory;
  tempServicesByCategory: ServicesByCategory;
  showMore: boolean;
  selectedIndex: number;
  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}
  @Input() set services(val: any) {
    this.serviceList = val;

    this.categoryService.getAllCategories().then((data: any) => {
      //creates an index map with category names and position
      const categoryIndexMap = new Map<string, number>();
      data.serviceCategoryList.forEach((category: any) => {
        categoryIndexMap.set(category.name, category.position);
      });

      if (this.serviceList?.length) {
        this.tempServicesByCategory = this.serviceList.reduce(
          (acc: ServicesByCategory, service: Service) => {
            const categoryName =
              service?.serviceCategoryName || service?.categoryName;
            if (!acc[categoryName]) {
              acc[categoryName] = [];
            }
            acc[categoryName].push(service);
            return acc;
          },
          {}
        );

        //Sorts the categories based on the position from the category index map
        const sortedCategories = Object.keys(this.tempServicesByCategory).sort(
          (a, b) =>
            (categoryIndexMap.get(a) || 0) - (categoryIndexMap.get(b) || 0)
        );

        const sortedServicesByCategory: ServicesByCategory = {};
        sortedCategories.forEach((category) => {
          sortedServicesByCategory[category] =
            this.tempServicesByCategory[category];
        });
        this.servicesByCategory = sortedServicesByCategory;
      }
    });
  }

  //method to get the service categories in the accordian
  getServiceCategoryKeys(): string[] {
    try {
      if (this.servicesByCategory) {
        return Object.keys(this.servicesByCategory);
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error in getServiceCategoryKeys:', error);
      return [];
    }
  }

  setShowMore(showMoreFlag: boolean, index: number) {
    this.showMore = showMoreFlag;
    this.selectedIndex = index;
  }

  onSelectedService(id: any) {
    this.selectedServiceIdCheck.emit({
      id: id
    });
  }

  isChecked(id: any) {
    let checked = false;
    for (let i = 0; i < this.booking.selectedServices.length; i++) {
      if (this.booking.selectedServices[i].id == id) {
        checked = true;
      }
    }
    return checked;
  }

  onServiceClick = ($event: any, service: any) => {
    this.selectedServiceEmitter.emit({
      checked: $event.checked,
      service: service
    });
  };
}

interface Service {
  serviceCategoryName?: string;
  categoryName?: string;
  priceVaries: null | boolean;
  serviceCost: number;
  imageUrl: null | string;
  name: string;
  durationInMinutes: number;
  description: string;
  currencySymbol: string;
  currency: string;
  id: number;
  isPreBookingCostAllowed: boolean;
  url: null | string;
  showDepositCost?: boolean;
  depositCost: number;
}

interface ServicesByCategory {
  [categoryName: string]: Service[];
}
