import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import BaseService from '../base-service/base.service';
import { Category } from './Category';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

  entity = 'category';

  // Define all service URLs
  urls = {
    getAllCategories: '/category/all'
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
  public getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url(this.urls.getAllCategories));
  }

  public getCategories(options = null): Observable<Category[]> {
    return this.http.get<Category[]>(this.url(this.urls.getAllCategories, options));
  }

}
