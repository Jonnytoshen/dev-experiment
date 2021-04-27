import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { OverlayPortalPlacement } from './typings';

@Component({
  selector: 'dev-overlay-portal',
  exportAs: 'devOverlayPortal',
  templateUrl: './overlay-portal.component.html',
  styleUrls: ['./overlay-portal.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.placement]': `placement`,
    '[class.dev-overlay-portal-bottom]': `placement === 'bottom'`,
    '[class.dev-overlay-portal-bottom-left]': `placement === 'bottom-left'`,
    '[class.dev-overlay-portal-bottom-right]': `placement === 'bottom-right'`,
    '[class.dev-overlay-portal-left]': `placement === 'left'`,
    '[class.dev-overlay-portal-left-top]': `placement === 'left-top'`,
    '[class.dev-overlay-portal-left-bottom]': `placement === 'left-bottom'`,
    '[class.dev-overlay-portal-right]': `placement === 'right'`,
    '[class.dev-overlay-portal-right-top]': `placement === 'right-top'`,
    '[class.dev-overlay-portal-right-bottom]': `placement === 'right-bottom'`,
    '[class.dev-overlay-portal-top]': `placement === 'top'`,
    '[class.dev-overlay-portal-top-left]': `placement === 'top-left'`,
    '[class.dev-overlay-portal-top-right]': `placement === 'top-right'`,
  }
})
export class OverlayPortalComponent implements OnInit {

  @Input() innerContent!: string;
  @Input() placement: OverlayPortalPlacement = OverlayPortalPlacement.TOP;

  constructor(
    private elementRef: ElementRef<HTMLDivElement>
  ) {
    this.elementRef.nativeElement.classList.add('dev-overlay-portal');
  }

  ngOnInit(): void {
  }

}
