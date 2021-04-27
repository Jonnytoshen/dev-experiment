import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayPortalComponent } from './overlay-portal.component';

describe('OverlayPortalComponent', () => {
  let component: OverlayPortalComponent;
  let fixture: ComponentFixture<OverlayPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
