import { Component, Input, OnInit } from '@angular/core';
import { Article } from "../Article";

@Component({
  selector: 'app-article-card-full',
  templateUrl: './article-card-full.component.html',
  styleUrls: ['./article-card-full.component.less']
})
export class ArticleCardFullComponent implements OnInit {
  @Input() article: Article;

  constructor() {
  }

  ngOnInit() {
  }

}
