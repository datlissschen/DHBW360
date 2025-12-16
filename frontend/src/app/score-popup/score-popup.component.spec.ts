import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorePopupComponent } from './score-popup.component';

describe('ScorePopupComponent', () => {
  let component: ScorePopupComponent;
  let fixture: ComponentFixture<ScorePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScorePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
