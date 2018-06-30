import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../article/Article';
import { ArticleService } from '../../article/article.service';
import { Author } from '../../author/Author';
import { AuthorService } from '../../author/author.service';
import { Category } from '../../category/Category';

@Component({
  selector: 'app-article-slider',
  templateUrl: './article-slider.component.html',
  styleUrls: ['./article-slider.component.less']
})

export class ArticleSliderComponent implements OnInit {
  @Input() category: Category;
  public articles: Article[];
  public authors: Author[];

  private defaultArticleLimit = 4;

  constructor(
    private articleService: ArticleService,
    private authorService: AuthorService) {
  }

  ngOnInit() {
    this.getArticles();
    this.getAuthors();
  }

  /**
   * Get articles for this category
   */
  private getArticles() {
    this.articleService.getArticlesByCategory(this.category._id, this.defaultArticleLimit)
      .subscribe(data => {
        this.articles = data;
      });
  }

  /**
   * Get authos for this category
   */
  private getAuthors() {
    this.authorService.getAuthorsByCategory(this.category._id)
      .subscribe(data => {
        this.authors = data;
      });
  }

}
