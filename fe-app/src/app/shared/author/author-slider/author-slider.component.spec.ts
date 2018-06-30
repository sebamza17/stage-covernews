import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorSliderComponent } from './author-slider.component';

describe('AuthorSliderComponent', () => {
  let component: AuthorSliderComponent;
  let fixture: ComponentFixture<AuthorSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
