import { Component, Input, OnInit } from '@angular/core';
import { CategoryService } from "../../category/category.service";
import { Category } from "../../category/Category";
import { Article } from "../Article";
import { ArticleService } from "../article.service";

@Component({
  selector: 'app-article-base',
  templateUrl: './article-base.component.html',
  styleUrls: ['./article-base.component.less']
})
export class ArticleBaseComponent implements OnInit {
  @Input() article: Article;

  public isOnReadLaterList = false;
  public category: Category;

  constructor(
    protected categoryService: CategoryService,
    protected articleService: ArticleService) {
  }

  ngOnInit() {
  }

  /**
   * Get category for this article
   */
  protected async getCategory() {
    this.category = await this.categoryService.getCategoryById(this.article.category);
  }

  /**
   * Checks if this article is on read later list
   * @returns {Promise<void>}
   */
  protected async checkIfIsReadLaterList() {
    this.isOnReadLaterList = await this.articleService.isOnReadLaterList(this.article);
  }

  /**
   * Saves an article to LS
   */
  public async saveToReadLater($event) {
    console.log($event);
    $event.preventDefault();
    $event.stopPropagation();
    this.isOnReadLaterList = await this.articleService.toggleArticleFromReadLater(this.article);
    // This stops the proopagation for this event
    return false;
  }

}
