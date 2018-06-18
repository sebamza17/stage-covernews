import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSliderComponent } from './article-slider.component';

describe('ArticleSliderComponent', () => {
  let component: ArticleSliderComponent;
  let fixture: ComponentFixture<ArticleSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
