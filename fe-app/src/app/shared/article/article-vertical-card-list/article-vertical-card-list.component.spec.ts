import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleVerticalCardListComponent } from './article-vertical-card-list.component';

describe('ArticleVerticalCardListComponent', () => {
  let component: ArticleVerticalCardListComponent;
  let fixture: ComponentFixture<ArticleVerticalCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleVerticalCardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleVerticalCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
