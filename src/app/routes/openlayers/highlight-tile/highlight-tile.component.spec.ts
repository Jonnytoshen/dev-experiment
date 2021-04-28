import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightTileComponent } from './highlight-tile.component';

describe('HighlightTileComponent', () => {
  let component: HighlightTileComponent;
  let fixture: ComponentFixture<HighlightTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighlightTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
