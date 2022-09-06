import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhonePipe } from './phone-pipe/phone.pipe';
import { SerialPipe } from './serial-number/serial.pipe';

@NgModule({
  declarations: [
    PhonePipe,
    SerialPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PhonePipe,
    SerialPipe
  ]
})
export class SharedModule { }
