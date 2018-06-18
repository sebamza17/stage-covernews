import { Component, OnInit } from '@angular/core';
import { Category } from '../../shared/category/Category';
import { CategoryService } from '../../shared/category/category.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  providers: [CategoryService]
})
export class HomeComponent implements OnInit {

  public loading: boolean;
  public categories: Category[];

  constructor(
    private categoryService: CategoryService) {
  }

  ngOnInit() {

    // Get all categories from API
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });

  }

}
