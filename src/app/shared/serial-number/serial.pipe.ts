import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'serial'
})
export class SerialPipe implements PipeTransform {

  transform(serialNumber: string): unknown {
    return `${serialNumber.slice(0, 4)}-${serialNumber.slice(4)}`;
  }
}
