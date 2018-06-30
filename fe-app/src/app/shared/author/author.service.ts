import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import BaseService from '../base-service/base.service';
import { Author } from './Author';
import { Category } from "../category/Category";
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AuthorService extends BaseService {

  entity = 'author';

  // Define all service URLs
  urls = {
    getAll: '/author/all',
    getByCategory: '/author/category/{{categoryId}}',
    follow: '/author/follow',
  };

  constructor(
    private http: HttpClient
  ) {
    super();
  }

  /**
   * Get all authors from API
   * @returns Observable<Author[]>
   */
  public getAllAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.url(this.urls.getAll));
  }

  /**
   * TODO: Add description to this method
   * @returns {Observable<Author[]>}
   */
  public getFollowAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.url(this.urls.follow));
  }

  /**
   * Follows a given author
   * @param author
   */
  public followAuthor(author: string) {
    return this.http.post(this.url(this.urls.follow), {follow: {author: author}});
  }

  /**
   * Get all authors by a given category
   * TODO: Replace this endpoint when ready! Now is returning all authors
   * @param {string} categoryId
   * @returns {Observable<Object>}
   */
  public getAuthorsByCategory(categoryId: string) {
    // return this.http.get(this.url(this.urls.getByCategory.replace('{{categoryId}}', categoryId)));
    return this.http.get<Author[]>(this.url(this.urls.getAll));
  }

}
