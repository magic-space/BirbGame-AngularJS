import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeepComponent } from './peep.component';

describe('PeepComponent', () => {
  let component: PeepComponent;
  let fixture: ComponentFixture<PeepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
