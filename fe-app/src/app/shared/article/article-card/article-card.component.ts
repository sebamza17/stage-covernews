import { Component, Input, OnInit } from '@angular/core';
import { Article } from "../Article";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.less']
})
export class ArticleCardComponent implements OnInit {
  @Input() article: Article;

  constructor() {
  }

  ngOnInit() {
  }

}
