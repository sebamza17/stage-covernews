import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Category } from '../../shared/category/Category';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  providers: []
})
export class HomeComponent implements OnInit {

  public categories: Category[];
  public loading: boolean;
  public selectedCategory: Category;

  constructor(
    private homeService: HomeService) {
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
  }

  /**
   * Get Categories
   */
  private getCategories() {
    this.homeService.getCategories()
      .subscribe(data => {

        let counter = 0;
        let categories = data.filter((category) => {
          counter++;
          if (counter < 8) {
            return category;
          }
        });

        this.categories = categories;
        this.selectedCategory = categories[0];
        this.homeService.categories = categories;
      });
  }
}
