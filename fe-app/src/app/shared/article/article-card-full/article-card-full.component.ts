import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../Article';
import { Category } from '../../category/Category';

@Component({
  selector: 'app-article-card-full',
  templateUrl: './article-card-full.component.html',
  styleUrls: ['./article-card-full.component.less']
})
export class ArticleCardFullComponent implements OnInit {
  @Input() article: Article;
  @Input() category: Category;

  constructor() {
  }

  ngOnInit() {
  }

}
