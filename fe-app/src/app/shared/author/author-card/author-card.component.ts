import { Component, Input, OnInit } from '@angular/core';
import { Author } from '../Author';
import { AuthorService } from '../author.service';

@Component({
  selector: 'app-author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.less']
})
export class AuthorCardComponent implements OnInit {
  @Input() author: Author;

  constructor(
    private authorService: AuthorService) {
  }

  ngOnInit() {
  }

  public follow(author: string) {
    return this.authorService.followAuthor(author);
  }

}
