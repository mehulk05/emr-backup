import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { BusinessHours } from '../../models/business/BusinessHours';

@Injectable({
  providedIn: 'root'
})
export class BusinessHoursValidatorService {
  constructor() {}

  validateBusinessHours(): ValidatorFn {
    return (
      control: AbstractControl
    ): { [key: string]: boolean | string } | null => {
      let businessHours: BusinessHours[];
      if (control instanceof FormControl) {
        businessHours = control.value;
      } else {
        businessHours =  control.get('businessHours')?.value;
      }
      const checkedHours = businessHours?.filter((hour) => hour.checked);
      if (checkedHours?.length == 0) {
        return {
          required: true
        };
      }
      const invalidTimeIndex = checkedHours?.findIndex(
        (hour) =>
          !(
            hour.openHour &&
            hour.closeHour &&
            hour.openHour.getTime() < hour.closeHour.getTime()
          )
      );
      if (invalidTimeIndex != -1) {
        return {
          invalidTime: `Invalid Time selected for ${checkedHours[invalidTimeIndex].day}`
        };
      }
      return null;
    };
  }
}
