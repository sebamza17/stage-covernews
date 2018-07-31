import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../Article';
import { Category } from '../../category/Category';
import { ArticleBaseComponent } from '../article-base/article-base.component';

@Component({
  selector: 'app-article-card-full',
  templateUrl: './article-card-full.component.html',
  styleUrls: ['./article-card-full.component.less']
})
export class ArticleCardFullComponent extends ArticleBaseComponent implements OnInit {
  @Input() article: Article;
  @Input() category: Category;

  ngOnInit() {
  }

}
