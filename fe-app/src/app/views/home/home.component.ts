import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { HomeService } from './home.service';
import { Category } from '../../shared/category/Category';
import { CategoryService } from "../../shared/category/category.service";
import { Author } from '../../shared/author/Author';
import { AuthorService } from "../../shared/author/author.service";
import { Article } from "../../shared/article/Article";
import { ArticleService } from "../../shared/article/article.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  providers: []
})
export class HomeComponent implements OnInit {

  public categories: Category[];
  public authors: Author[];
  public loading: boolean;
  public selectedCategory: Category;
  public readLaterArticleList: Article[];
  public readLaterArticleCount = 0;

  // UI Status
  public articleSearchMenuOpen = false;
  public readLaterArticleListLoading = false;

  constructor(
    private homeService: HomeService,
    private categoryService: CategoryService,
    private authorService: AuthorService,
    private articleService: ArticleService) {
  }

  /**
   * Opens the lateral menu with the read later news, sets loading on UI until API returns articles
   */
  public toggleArticleSearchMenu() {
    this.articleSearchMenuOpen = !this.articleSearchMenuOpen;

    // Only go to the API if articles are not on the scope yet
    if (!this.readLaterArticleList || this.readLaterArticleList.length < 1) {
      this.readLaterArticleListLoading = true;
      this.getReadLaterArticles().then((articleList) => {
        this.readLaterArticleListLoading = false;
        this.readLaterArticleList = articleList;
      });
    }
  }

  ngOnInit() {
    this.walkThrough();
  }

  /**
   * Get read later articles for this user (from LocalStorage)
   */
  private getReadLaterArticles() {
    return this.articleService.getReadLaterArticles();
  }

  /**
   * Scrolls the category slider to a specific category item
   * @param category
   */
  public selectCategory(category) {

    this.selectedCategory = category;

    const categorySliderDOM = $('.category-carousel__wrapper');
    const currentScroll = categorySliderDOM.scrollLeft();
    const selectedCategoryOffset = $('[category="' + category._id + '"]').offset().left;

    categorySliderDOM.animate({
      scrollLeft: currentScroll + selectedCategoryOffset
    });
  }

  /**
   * Walk Through
   */
  private walkThrough() {
    this.getCategories();
    this.getPopularAuthors();
    this.articleService.getCountReadLaterArticles().then((count) => {
      this.readLaterArticleCount = count;
    });
  }

  /**
   * Get Categories
   */
  private getCategories() {
    this.categoryService.getCategories({
      limit: 100
    }).subscribe(data => {
      this.categories = data;
      this.selectedCategory = data[0];
      this.homeService.categories = data;
    });
  }

  private getPopularAuthors() {
    this.authorService.getAllAuthors()
      .subscribe(data => {
        console.log(data);
        this.authors = data;
      });
  }
}
