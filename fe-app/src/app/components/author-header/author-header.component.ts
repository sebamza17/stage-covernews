import { Component, OnInit, Input } from '@angular/core';
import { Author } from '../../shared/author/Author';
import { AuthorService } from '../../shared/author/author.service';

@Component({
  selector: 'app-author-header',
  templateUrl: './author-header.component.html',
  styleUrls: ['./author-header.component.less']
})
export class AuthorHeaderComponent implements OnInit {
  @Input() isFull = false;
  @Input() author: Author;
  public isDescriptionShown = false;

  constructor(
    private authorService: AuthorService) {
  }

  ngOnInit() {
    this.author = <Author>this.authorService.generatePlaceholders(1, {
      name: '███ ██████',
      avatar: '',
      description: '██ ███ ████████ ███ ████████ ███ ████████ ███ ████████ ███ ████████ ███ ██████'
    });
    $('.author-header__description').hide();
  }

  public toggleInfo() {
    $('.author-header__description').toggle(400);
    this.isDescriptionShown = !this.isDescriptionShown;
  }


}
