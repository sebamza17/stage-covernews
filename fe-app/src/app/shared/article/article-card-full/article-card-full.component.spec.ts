import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleCardFullComponent } from './article-card-full.component';

describe('ArticleCardFullComponent', () => {
  let component: ArticleCardFullComponent;
  let fixture: ComponentFixture<ArticleCardFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleCardFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleCardFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
