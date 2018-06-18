import { Component, Input, OnInit } from '@angular/core';
import { Category } from "../../category/Category";

@Component({
  selector: 'app-article-slider',
  templateUrl: './article-slider.component.html',
  styleUrls: ['./article-slider.component.less']
})
export class ArticleSliderComponent implements OnInit {
  @Input() category: Category;

  constructor() {
  }

  ngOnInit() {
    console.log(this.category);
  }

}
