import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import BaseService from '../base-service/base.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

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
   * @returns {Observable<any>}
   */
  getAllCategories(): Observable<any> {
    return this.http.get(this.url(this.urls.getAllCategories));
  }
  
}
