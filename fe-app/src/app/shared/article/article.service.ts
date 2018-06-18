import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import BaseService from '../base-service/base.service';

@Injectable()
export class ArticleService extends BaseService {

  // Define all service URLs
  urls = {};

  constructor(
    private http: HttpClient
  ) {
    super();
  }

}
