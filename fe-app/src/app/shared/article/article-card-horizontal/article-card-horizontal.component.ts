import { Component, Input, OnInit } from '@angular/core';
import { Article } from "../Article";

@Component({
  selector: 'app-article-card-horizontal',
  templateUrl: './article-card-horizontal.component.html',
  styleUrls: ['./article-card-horizontal.component.less']
})
export class ArticleCardHorizontalComponent implements OnInit {
  @Input() article: Article;

  constructor() {
  }

  ngOnInit() {
  }

}
