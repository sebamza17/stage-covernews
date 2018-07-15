import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-article-content',
  template: '<div class="article-content" [innerHTML]="articleContent | safeHtml"></div>',
  styleUrls: ['./article-content.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleContentComponent implements OnInit {
  @Input() articleContent: string;

  constructor() {
  }

  ngOnInit() {
  }

}
