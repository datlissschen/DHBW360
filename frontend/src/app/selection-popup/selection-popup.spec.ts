import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionPopup } from './selection-popup';

describe('SelectionPopup', () => {
  let component: SelectionPopup;
  let fixture: ComponentFixture<SelectionPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
