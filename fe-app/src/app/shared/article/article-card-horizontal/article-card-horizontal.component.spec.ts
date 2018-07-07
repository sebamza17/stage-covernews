import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCardHorizontalComponent } from './article-card-horizontal.component';

describe('ArticleCardHorizontalComponent', () => {
  let component: ArticleCardHorizontalComponent;
  let fixture: ComponentFixture<ArticleCardHorizontalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleCardHorizontalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCardHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
