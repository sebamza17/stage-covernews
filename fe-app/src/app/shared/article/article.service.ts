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

  entity = 'article';

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
  public getArticlesByCategory(categoryId, limit = 0, skip = 0): Observable<Article[]> {

    let url = this.urls.getArticlesByCategory;

    if (limit > 0) {
      url += '?limit=' + limit;
    }
    if (skip > 0) {
      url += '?skip=' + skip;
    }

    url = url.replace('{{categoryId}}', categoryId);

    return this.http.get<Article[]>(this.url(url));
  }

  /**
   * Get one article for each category that the user follows
   * @returns {Observable<Article[]>}
   */
  public getOneArticlesByEachFollowCategory(): Observable<Article[]> {
    return this.http.get<Article[]>(this.url('/article/following/categories'));
  }

  /**
   * Get one article for eache author that the user follows
   * @returns {Observable<Article[]>}
   */
  public getOneArticlesByEachFollowAuthor(): Observable<Article[]> {
    return this.http.get<Article[]>(this.url('/article/following/authors'));
  }

}
