import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionPopupComponent } from './selection-popup.component';

describe('SelectionPopupComponent', () => {
  let component: SelectionPopupComponent;
  let fixture: ComponentFixture<SelectionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
