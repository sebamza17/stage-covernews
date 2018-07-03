import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleLatestComponent } from './article-latest.component';

describe('ArticleLatestComponent', () => {
  let component: ArticleLatestComponent;
  let fixture: ComponentFixture<ArticleLatestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleLatestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleLatestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
