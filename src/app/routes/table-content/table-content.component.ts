import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef } from '@angular/core';

@Component({
  selector: 'dev-table-content',
  templateUrl: './table-content.component.html',
  styleUrls: ['./table-content.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableContentComponent implements OnInit {

  constructor(
    private elementRef: ElementRef<HTMLDivElement>
  ) {
    this.elementRef.nativeElement.classList.add('dev-table-content');
  }

  ngOnInit(): void {
  }

}
