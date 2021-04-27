import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemPointQueryComponent } from './dem-point-query.component';

describe('DemPointQueryComponent', () => {
  let component: DemPointQueryComponent;
  let fixture: ComponentFixture<DemPointQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemPointQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemPointQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
