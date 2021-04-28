import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonShadowEffectComponent } from './polygon-shadow-effect.component';

describe('PolygonShadowEffectComponent', () => {
  let component: PolygonShadowEffectComponent;
  let fixture: ComponentFixture<PolygonShadowEffectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolygonShadowEffectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonShadowEffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
