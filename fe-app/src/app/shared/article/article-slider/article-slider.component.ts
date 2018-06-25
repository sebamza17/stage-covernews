import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../article/Article';
import { ArticleService } from '../../article/article.service';
import { Category } from '../../category/Category';

@Component({
  selector: 'app-article-slider',
  templateUrl: './article-slider.component.html',
  styleUrls: ['./article-slider.component.less']
})
export class ArticleSliderComponent implements OnInit {
  @Input() category: Category;
  public articles: Article[];

  private defaultArticleLimit = 4;

  constructor(
    private articleService: ArticleService) {
  }

  ngOnInit() {
    this.getArticles();
  }

  /**
   * Get articles for given category
   */
  private getArticles() {
    this.articleService.getArticlesByCategory(this.category._id, this.defaultArticleLimit)
      .subscribe(data => {
        this.articles = data;
      });
  }

}
