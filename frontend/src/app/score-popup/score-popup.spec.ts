import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorePopup } from './score-popup';

describe('ScorePopup', () => {
  let component: ScorePopup;
  let fixture: ComponentFixture<ScorePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorePopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScorePopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
