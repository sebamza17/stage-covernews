import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import BaseService from '../base-service/base.service';
import { Author } from './Author';
import { Globals } from '../../globals';
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
    followedAuthors: '/author/follow',
  };

  constructor(
    private globals: Globals,
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
   * Get all authors being followed by the current user
   * @returns {Observable<Author[]>}
   */
  public getFollowedAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.url(this.urls.followedAuthors));
  }

  /**
   * Follows a given author. Uses the logged user on back-end
   * @param author
   */
  public async followAuthor(author: Author) {
    let returnValue = false;

    if (!author || !author._id) {
      return false;
    }

    const currentAuthors = await this.globals.getValue('user', 'followedAuthors') || [];

    // Check if author already exists, if do, remove it, if do not, add it and save to LS
    if (currentAuthors.length > 0 && currentAuthors.indexOf(author._id) > -1) {
      currentAuthors.splice(currentAuthors.indexOf(author._id), 1);
      returnValue = false;
    } else {
      const result = <any>await this.http.post(this.url(this.urls.follow), {
        follow: {author: author._id}
      }).toPromise();
      if (!result.ok || result.ok !== 1) {
        return false;
      }
      currentAuthors.push(author._id);
      returnValue = true;
    }
    await this.globals.setValue('user', 'followedAuthors', currentAuthors);
    return returnValue;
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
