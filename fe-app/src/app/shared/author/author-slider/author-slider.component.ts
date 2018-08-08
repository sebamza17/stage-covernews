import { Component, Input, OnInit } from '@angular/core';
import { Author } from '../Author';

@Component({
  selector: 'app-author-slider',
  templateUrl: './author-slider.component.html',
  styleUrls: ['./author-slider.component.less']
})
export class AuthorSliderComponent implements OnInit {
  @Input() authors: Author[];

  constructor() {
  }

  ngOnInit() {
  }

}
