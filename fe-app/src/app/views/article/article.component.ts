import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../shared/article/article.service';
import { Article } from '../../shared/article/Article';
import { Author } from '../../shared/author/Author';
import { AuthorService } from '../../shared/author/author.service';
import { Category } from '../../shared/category/Category';
import { CategoryService } from '../../shared/category/category.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.less']
})
export class ArticleComponent implements OnInit {

  public articleId: string = null;
  public article: Article;
  public category: Category;
  public author: Author;
  public relatedArticles: Article[];
  public authorArticles: Article[];

  // UI status
  public loading = true;

  constructor(
    private categoryService: CategoryService,
    private articleService: ArticleService,
    private authorService: AuthorService,
    private activeRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.article = <Article>this.articleService.generatePlaceholders(1, {
      title: '██ ███ ██████',
      authorName: '██ ██████',
      content: '██████ ███ █████████ ██████ ████████████ ███ ██ ██████ ██ ██████ ████ ████████ ██ ██'
    });
    this.category = <Category>this.categoryService.generatePlaceholders(1, {
      name: '██ ███ ██████',
    });
    this.author = <Author>this.authorService.generatePlaceholders(1, {
      name: '███ ██████',
      avatar: '',
      description: '██ ███ ████████ ███ ████████ ███ ████████ ███ ████████ ███ ████████ ███ ██████'
    });
    this.relatedArticles = <Article[]>this.articleService.generatePlaceholders(4, {
      title: '██ ███ ██████',
      authorName: '██ ██████',
      content: '██████ ███ █████████ ██████ ████████████ ███ ██ ██████ ██ ██████ ████ ████████ ██ ██'
    });
    this.articleId = this.activeRoute.snapshot.params['articleId'];
    if (!this.articleId) {
      this.router.navigate(['/home']);
      return;
    }
    this.getArticle();
  }

  /**
   * Get the article from URL param
   */
  private getArticle() {
    this.articleService.getArticleFullById(this.articleId).then((article) => {
      this.article = article;
      this.loading = false;
      this.getAuthor();
      this.getRelatedArticles();
      this.category.name = this.article.categoryObject.name;
    });
  }

  /**
   * Get author for this article
   */
  private getAuthor() {
    if (!this.article.authorId) {
      this.author.name = this.article.authorName;
      return;
    }
    this.authorService.getAuthorById(this.article.authorId).subscribe((author) => {
      this.author = author;

      this.articleService.getArticlesByAuthor(this.author._id).subscribe((articles) => {
        this.authorArticles = articles;
      });

    });
  }

  /**
   * Get related articles for this article
   * TODO: Change endpoint when ready
   */
  private getRelatedArticles() {
    this.articleService.getRelatedArticles(this.article._id, {
      limit: 4
    }).subscribe((articles) => {
      this.relatedArticles = articles;
    });
  }

}
