import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { Category } from '../../shared/category/Category';
import { Author } from '../../shared/author/Author';

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

  constructor(
    private homeService: HomeService) {
  }

  ngOnInit() {
    this.walkThrough();
  }

  public follow(author: string){
    this.homeService.followAuthor(author)
    .subscribe((data)=>{
      console.log(data);
    })
  }

  /**
   * Walk Trhougt
   */
  private walkThrough(){
    this.getCategories();
    this.getAuthors();
  }

  /**
   * Get Categories
   */
  private getCategories(){
    this.homeService.getCategories()
    .subscribe(data=> {
      this.categories = data;
      this.homeService.categories = data;
    });
  }

  /**
   * Get Authors
   */
  private getAuthors(){
    this.homeService.getAuthors()
    .subscribe((res)=>{
      this.authors = res;
    });
  };
}
