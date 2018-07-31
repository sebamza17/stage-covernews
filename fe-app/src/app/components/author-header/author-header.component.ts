import { Component, OnInit, Input } from '@angular/core';
import { Author } from '../../shared/author/Author';

@Component({
  selector: 'app-author-header',
  templateUrl: './author-header.component.html',
  styleUrls: ['./author-header.component.less']
})
export class AuthorHeaderComponent implements OnInit {
  @Input() isFull = false;
  @Input() author: Author;
  public isDescriptionShown = false;

  constructor() {
  }

  ngOnInit() {
    $('.author-header__description').hide();
  }

  public toggleInfo() {
    $('.author-header__description').toggle(400);
    this.isDescriptionShown = !this.isDescriptionShown;
  }


}
