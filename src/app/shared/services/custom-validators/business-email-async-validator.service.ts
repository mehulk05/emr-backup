import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { BusinessService } from '../business.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessEmailAsyncValidatorService {
  constructor(private businessService: BusinessService) {}

  emailAlreadyExistsValidator(bid: any): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors> => {
      return this.businessService
        .checkBusinessEmailExists(bid, control.value)
        .then((emailExists) => {
          return emailExists
            ? {
                emailAlreadyExists: true
              }
            : null;
        });
    };
  }

  nameAlreadyExistsValidator(bid: any): any {
    return (control: AbstractControl): any => {
      return this.businessService
        .checkBusinessNameExists(bid, control.value)
        .then((nameExists) => {
          return nameExists
            ? {
                nameAlreadyExists: true
              }
            : null;
        });
    };
  }
}
