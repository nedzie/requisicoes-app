import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment'

export function ValidarData(): ValidatorFn {
  return (input: AbstractControl): ValidationErrors | null => {
    const dataEscolhida =  moment(input.value);
    const hoje = moment();

    if(!dataEscolhida)
      return null;

    return dataEscolhida > hoje ? { invalidDate: true }: null;
  }
}
