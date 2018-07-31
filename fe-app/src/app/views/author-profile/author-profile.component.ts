import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorService } from '../../shared/author/author.service';
import { Author } from '../../shared/author/Author';
import { ArticleService } from '../../shared/article/article.service';
import { Article } from '../../shared/article/Article';

@Component({
  selector: 'app-author-profile',
  templateUrl: './author-profile.component.html',
  styleUrls: ['./author-profile.component.less']
})
export class AuthorProfileComponent implements OnInit {

  public author: Author;
  public mainArticle: Article;
  public articles: Article[];

  // UI Status
  public loading = true;

  // Private variables
  private authorId;

  constructor(
    private articleService: ArticleService,
    private authorService: AuthorService,
    private activeRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.author = <Author>this.authorService.generatePlaceholders(1, {
      name: '███ ██████',
      avatar: '',
      description: '██ ███ ████████ ███ ████████ ███ ████████ ███ ████████ ███ ████████ ███ ██████'
    });
    this.mainArticle = <Article>this.articleService.generatePlaceholders(1, {
      title: '██ ███ ██████',
      authorName: '██ ██████',
      content: '██████ ███ █████████ ██████ ████████████ ███ ██ ██████ ██ ██████ ████ ████████ ██ ██'
    });
    this.articles = <Article[]>this.articleService.generatePlaceholders(4, {
      title: '██ ███ ██████',
      authorName: '██ ██████',
      content: '██████ ███ █████████ ██████ ████████████ ███ ██ ██████ ██ ██████ ████ ████████ ██ ██'
    });

    this.authorId = this.activeRoute.snapshot.params['authorId'];
    if (!this.authorId) {
      this.router.navigate(['/home']);
      return;
    }
    this.getAuthor();
  }

  /**
   * Get author from API using param
   */
  private getAuthor() {
    this.authorService.getAuthorById(this.authorId).subscribe((author) => {
      this.author = author;
      console.log(this.author);
      this.getArticles();
    });
  }

  /**
   * Get articles for this author
   */
  private getArticles() {
    if (!this.author) {
      return;
    }
    this.articleService.getArticlesByAuthor(this.author._id).subscribe((articles) => {
      this.loading = false;
      this.mainArticle = articles.shift();
      this.articles = articles;
    });
  }

}
