import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import BaseService from '../base-service/base.service';
import { Author } from './Author';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AuthorService extends BaseService {

  // Define all service URLs
  urls = {
    getAllAuthors: '/author/all'
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
  public getAllAuthors(): Observable<Author[]>{
    return this.http.get<Author[]>(this.url(this.urls.getAllAuthors));
  }
  
}
