import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-article-content',
  template: '<div class="article-content" [ngClass]="{\'article-content--clean\': isCleanText}" [innerHTML]="articleContent | safeHtml"></div>',
  styleUrls: ['./article-content.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleContentComponent implements OnInit {
  @Input() articleContent: string;
  @Input() isCleanText: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
