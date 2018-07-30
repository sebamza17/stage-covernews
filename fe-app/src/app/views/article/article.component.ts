import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../shared/article/article.service';
import { Article } from '../../shared/article/Article';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.less']
})
export class ArticleComponent implements OnInit {

  public articleId: string = null;
  public article: Article;

  // UI Status
  public loading: boolean = true;

  constructor(
    private articleService: ArticleService,
    private activeRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
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
      console.log(this.article);
    });
  }

}
