import { Component, Input, OnInit } from '@angular/core';
import { Author } from "../Author";

@Component({
  selector: 'app-author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.less']
})
export class AuthorCardComponent implements OnInit {
  @Input() author: Author;

  constructor() {
  }

  ngOnInit() {
  }

}
