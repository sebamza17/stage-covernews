import { Component, Input, OnInit } from '@angular/core';
import { Article } from "../Article";
import { CategoryService } from "../../category/category.service";
import { Category } from "../../category/Category";

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.less']
})
export class ArticleCardComponent implements OnInit {
  @Input() article: Article;
  @Input() showCategory: boolean;
  @Input() isTransparent: boolean;

  public category: Category;

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit() {
    if (this.showCategory) {
      this.getCategory();
    }
  }

  private getCategory() {
    this.categoryService.getCategoryById(this.article.category).subscribe(data => {
      console.log(data);
      this.category = data;
    });
  }

}
