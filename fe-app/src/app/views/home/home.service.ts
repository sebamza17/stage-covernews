import { Injectable } from '@angular/core';
import BaseService from '../../shared/base-service/base.service';
import { CategoryService } from '../../shared/category/category.service';
import { Category } from '../../shared/category/Category';

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseService {

  categories: Category[];
  banner: Object;

  constructor(public categorySvc: CategoryService) {
    super();
  }


  public getBanner() {

  }

  public getSuggestedAuthors() {

  }

  public getCategories() {
    return this.categorySvc.getAllCategories();
  }

}
