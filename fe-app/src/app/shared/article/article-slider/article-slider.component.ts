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

  //UI status
  public articleLoading: boolean = true;
  public authorLoading: boolean = true;
  private alreadyLoaded: boolean = false;

  // Query params
  private defaultArticleLimit: number = 4;
  private defaultAuthorLimit: number = 5;

  constructor(
    private articleService: ArticleService,
    private authorService: AuthorService) {
  }

  ngOnInit() {

    this.authors = this.authorService.generatePlaceholders(this.defaultAuthorLimit, {
      name: '██ ██████',
    });
    this.articles = this.articleService.generatePlaceholders(this.defaultArticleLimit, {
      title: '██ ███ ██████',
      authorName: '██ ██████',
      content: '██████ ███ █████████ ██████ ████████████ ███ ██ ██████ ██ ██████ ████ ████████ ██ ██'
    });

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
   * Get articles for this category
   */
  private getArticles() {
    this.articleService.getArticlesByCategory(this.category._id, this.defaultArticleLimit)
      .subscribe(data => {
        this.articleLoading = false;
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
