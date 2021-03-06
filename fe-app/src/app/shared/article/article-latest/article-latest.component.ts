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
    this.articles = <Article[]>this.articleService.generatePlaceholders(8, {
      title: '██ ███ ██████',
      authorName: '██ ██████',
      content: '██████ ███ █████████ ██████ ████████████ ███ ██ ██████ ██ ██████ ████ ████████ ██ ██',
      categoryName: '█████████'
    });
    this.getLatestArticles();
  }

  /**
   * Get latest articles
   */
  private getLatestArticles() {

    this.articleService.getLatestArticles()
      .subscribe(data => {
        this.articles = data;
      });
  }

}
