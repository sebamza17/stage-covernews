import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { HomeService } from './home.service';
import { Category } from '../../shared/category/Category';
import { CategoryService } from "../../shared/category/category.service";
import { Author } from '../../shared/author/Author';
import { AuthorService } from "../../shared/author/author.service";

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

  // UI Status
  public articleSearchMenuOpen = false;

  constructor(
    private homeService: HomeService,
    private categoryService: CategoryService,
    private authorService: AuthorService) {
  }

  public toggleArticleSearchMenu() {
    this.articleSearchMenuOpen = !this.articleSearchMenuOpen;
  }

  ngOnInit() {
    this.walkThrough();
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
  }

  /**
   * Get Categories
   */
  private getCategories() {
    this.categoryService.getCategories({
      limit: 100
    }).subscribe(data => {
      console.log(data);
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
