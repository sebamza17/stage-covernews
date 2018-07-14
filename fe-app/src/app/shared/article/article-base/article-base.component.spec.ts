import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleBaseComponent } from './article-base.component';

describe('ArticleBaseComponent', () => {
  let component: ArticleBaseComponent;
  let fixture: ComponentFixture<ArticleBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
