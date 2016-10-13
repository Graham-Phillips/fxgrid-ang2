import {Directive, Input, ElementRef} from '@angular/core';

@Directive ({
  selector: '[gpSortButton]'
})

export class SortHeaderDirective
{
static get UP_ARROW_UNICODE() { return '&#x25b2'; };
static get DOWN_ARROW_UNICODE() { return '&#x25bc'; };

  constructor(private el: ElementRef)
  {
  }

@Input()
	set gpSortButton(ascending : boolean) {
	 if(ascending)
   {
    this.el.nativeElement.innerHTML = SortHeaderDirective.UP_ARROW_UNICODE;
   }
   else
   {
    this.el.nativeElement.innerHTML = SortHeaderDirective.DOWN_ARROW_UNICODE;
   }
	}
}
