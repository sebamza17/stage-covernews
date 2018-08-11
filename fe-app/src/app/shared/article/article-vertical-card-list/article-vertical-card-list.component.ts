import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../Article';

@Component({
  selector: 'app-article-vertical-card-list',
  templateUrl: './article-vertical-card-list.component.html',
  styleUrls: ['./article-vertical-card-list.component.less']
})
export class ArticleVerticalCardListComponent implements OnInit {
  @Input() articles: Article[];

  constructor() {
  }

  ngOnInit() {
  }

}
