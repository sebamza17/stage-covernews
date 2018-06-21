import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Category } from '../../shared/category/Category';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  providers: []
})
export class HomeComponent implements OnInit {

  public categories: Category[];
  public loading: boolean;

  constructor(
    private homeService: HomeService) {
  }

  ngOnInit() {
    this.walkThrough();
  }

  /**
   * Walk Trhougt
   */
  private walkThrough(){
    this.homeService.getCategories()
    .subscribe(data=> {
      this.categories = data;
      this.homeService.categories = data;
    });
  }

}
