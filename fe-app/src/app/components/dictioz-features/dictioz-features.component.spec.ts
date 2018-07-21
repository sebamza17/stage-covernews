import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictiozFeaturesComponent } from './dictioz-features.component';

describe('DictiozFeaturesComponent', () => {
  let component: DictiozFeaturesComponent;
  let fixture: ComponentFixture<DictiozFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DictiozFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictiozFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
