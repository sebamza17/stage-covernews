import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Author } from '../Author';
import { AuthorService } from '../author.service';

@Component({
  selector: 'app-author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.less']
})
export class AuthorCardComponent implements OnInit {
  @Input() author: Author;

  private authorId;

  constructor(
    private authorService: AuthorService,
    private activeRoute: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.authorId = this.activeRoute.snapshot.params['authorId'];
    if (!this.authorId) {
      this.router.navigate(['/home']);
      return;
    }
    this.getAuthor();
  }

  public follow(author: string) {
    return this.authorService.followAuthor(author);
  }

  private getAuthor() {
    this.authorService.getArticleFullById(this.articleId).then((article) => {
      this.article = article;
      this.loading = false;
      console.log(this.article);
    });
  }

}
