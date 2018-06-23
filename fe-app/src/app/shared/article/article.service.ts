import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import BaseService from '../base-service/base.service';
import { Article } from "./Article";

@Injectable({
  providedIn: 'root'
})
export class ArticleService extends BaseService {

  // Define all service URLs
  urls = {
    getArticlesByCategory: '/article/category/{{categoryId}}',
  };

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  /**
   * Get all articles for a given category
   * @param categoryId
   * @returns {Observable<Article[]>}
   */
  public getArticlesByCategory(categoryId): Observable<Article[]> {
    return this.http.get<Article[]>(this.url(
      this.urls.getArticlesByCategory.replace('{{categoryId}}', categoryId)
    ));
  }


}
