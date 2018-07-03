import { Component, Input, OnInit } from '@angular/core';
import { ArticleService } from "../article.service";
import { Article } from "../Article";

@Component({
  selector: 'app-article-latest',
  templateUrl: './article-latest.component.html',
  styleUrls: ['./article-latest.component.less']
})

export class ArticleLatestComponent implements OnInit {
  @Input() isLoggedIn: boolean;

  public articles: Article[];

  constructor(private articleService: ArticleService) {
  }

  ngOnInit() {

    this.getLatestArticles();

  }

  /**
   * Get latest articles
   */
  private getLatestArticles() {

    this.articleService.getLatestArticles()
      .subscribe(data => {
        console.log(data);
        this.articles = data;
      });
  }

}
