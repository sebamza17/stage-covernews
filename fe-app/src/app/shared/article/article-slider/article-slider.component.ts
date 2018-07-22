import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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
  @Input() lazyLoad: boolean;
  @Input() loadFlag: boolean;
  @Input() category: Category;
  public articles: Article[];
  public authors: Author[];
  public mainArticle: Article;

  // UI status
  public articleLoading: boolean = true;
  public authorLoading: boolean = true;
  private alreadyLoaded: boolean = false;

  // NgModels
  public articleSearchCriteria: string = '';

  // Query params
  private defaultArticleLimit: number = 5;
  private defaultAuthorLimit: number = 5;

  // Private variables
  private originalMainArticle: Article;
  private originalArticles: Article[] = [];

  constructor(
    private articleService: ArticleService,
    private authorService: AuthorService) {
  }

  ngOnInit() {

    // Set placeholders
    this.setPlaceholders();

    if (!this.lazyLoad) {
      this.getArticles();
      this.getAuthors();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // If lazyLoad option is enabled, only load when loadFlag changes to true, start init process
    if (this.lazyLoad && !this.alreadyLoaded && changes['loadFlag'] && changes['loadFlag'].currentValue) {
      this.alreadyLoaded = true;
      this.getArticles();
      this.getAuthors();
    }
  }

  /**
   * Searchs for articles by a given criteria
   */
  public searchForArticles() {

    if (!this.articleSearchCriteria || this.articleSearchCriteria.length < 1) {
      this.mainArticle = this.originalMainArticle;
      this.articles = this.originalArticles;
      return;
    }

    this.setPlaceholders();
    this.articleLoading = true;
    this.alreadyLoaded = false;
    this.articleService.getArticlesByQuery(this.articleSearchCriteria, {
      limit: 9,
    }).subscribe(data => {
      this.articleLoading = false;
      this.alreadyLoaded = true;
      this.mainArticle = data.shift();
      this.articles = data;
    });
  }

  /**
   * Set articles as placeholders while view loads
   */
  private setPlaceholders() {
    this.authors = <Author[]>this.authorService.generatePlaceholders(this.defaultAuthorLimit, {
      name: '██ ██████',
    });
    this.mainArticle = <Article>this.articleService.generatePlaceholders(1, {
      title: '██ ███ ██████',
      authorName: '██ ██████',
      content: '██████ ███ █████████ ██████ ████████████ ███ ██ ██████ ██ ██████ ████ ████████ ██ ██'
    });
    this.articles = <Article[]>this.articleService.generatePlaceholders(this.defaultArticleLimit - 1, {
      title: '██ ███ ██████',
      authorName: '██ ██████',
      content: '██████ ███ █████████ ██████ ████████████ ███ ██ ██████ ██ ██████ ████ ████████ ██ ██'
    });
  }

  /**
   * Get articles for this category.
   * Also assigns a set of articles as the original ones so we have something to show when search is empty
   */
  private getArticles() {
    this.articleService.getArticlesByCategory(this.category._id, {
      limit: this.defaultArticleLimit,
    }).subscribe(data => {
      if (!this.originalArticles || this.originalArticles.length < 1) {
        const duplicatedData = data.slice();
        this.originalMainArticle = duplicatedData.shift();
        this.originalArticles = duplicatedData;
      }
      this.articleLoading = false;
      this.mainArticle = data.shift();
      this.articles = data;
    });
  }

  /**
   * Get authos for this category
   */
  private getAuthors() {
    this.authorService.getAuthorsByCategory(this.category._id)
      .subscribe(data => {
        this.authorLoading = false;
        this.authors = data;
      });
  }

}
