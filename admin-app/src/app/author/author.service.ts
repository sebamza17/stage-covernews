import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {Author} from './author-interface'

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  authors: any;
  constructor(private http: HttpClient) {
    this.authors = this.get();
  }

  /**
   * Get all authors
   */
  get(){
    return this.http.get(environment.api+"author/all");
  }

  /**
   * Search authors by name
   * @param criteria 
   */
  search(criteria: string){
    if(!criteria){
      return this.get();
    }
    return this.http.get(environment.api+"author/search/"+criteria);
  }

  /**
   * Update one author
   * @param author 
   */
  update(author: Author){
    this.http.post(environment.api+"author/update/"+author._id,{author: author})
    .subscribe((data)=>{
      return data;
    });
  }
}
