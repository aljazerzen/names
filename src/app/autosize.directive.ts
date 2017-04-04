import { ElementRef, HostListener, Directive } from '@angular/core';

@Directive({
  selector: 'input[autosize]'
})

export class AutoSizeDirective {
  @HostListener('input', ['$event.target'])
  onInput(textArea: HTMLInputElement): void {
    this.adjust();
  }
  base: number;
  constructor(public element: ElementRef) {

  }
  ngAfterContentChecked(): void {
    this.adjust();
  }
  adjust(): void {
    if (!this.base) {
      this.base = 200;
    }
    this.element.nativeElement.style.overflow = 'hidden';
    this.element.nativeElement.size = Math.max(this.element.nativeElement.value.length, 7) - 2;
  }
}
