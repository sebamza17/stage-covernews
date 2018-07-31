import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import BaseService from '../base-service/base.service';
import { Author } from './Author';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AuthorService extends BaseService {

  entity = 'author';

  // Define all service URLs
  urls = {
    getAll: '/author/all',
    getById: '/author/show/{{authorId}}',
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
   * Get author by id from API
   * @param authorId
   */
  public getAuthorById(authorId): Observable<Author> {
    return this.http.get<Author>(this.url(this.urls.getById.replace('{{authorId}}', authorId)));
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
