import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import BaseService from '../base-service/base.service';
import { Category } from './Category';
import 'rxjs/add/operator/map';
import { reject } from '../../../../node_modules/@types/q';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

  // Categories
  public static staticCategories: Category[] = [];

  // Set local entity
  entity = 'category';

  // Define all service URLs
  urls = {
    getAllCategories: '/category/all',
    getCategory: '/category/show/{{categoryId}}',
  };

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  /**
   * Get all categories from API
   * @returns Observable<Category[]>
   */
  public async getAllCategories(options = null) {

    if (CategoryService.staticCategories.length < 1) {
      CategoryService.staticCategories = await this.http.get<Category[]>(this.url(this.urls.getAllCategories, options)).toPromise();
    }

    return CategoryService.staticCategories;
  }

  /**
   * Get all categories with a given options
   * @param {any} options
   * @returns {Observable<Category[]>}
   */
  public getCategories(options = null): Observable<Category[]> {
    return this.http.get<Category[]>(this.url(this.urls.getAllCategories, options));
  }

  /**
   * Get a specific category by a given id
   * @param categoryId
   * @returns {Observable<Category>}
   */
  public async getCategoryById(categoryId) {

    if (CategoryService.staticCategories.length > 0) {
      const foundCategory = CategoryService.staticCategories.find(category => {
        return category._id === categoryId;
      });
      return foundCategory;
    }

    return await this.http.get<Category>(this.url(this.urls.getCategory.replace('{{categoryId}}', categoryId))).toPromise();
  }

}
