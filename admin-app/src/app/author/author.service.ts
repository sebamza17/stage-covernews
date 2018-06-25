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
    return this.http.get(environment.api.author+"/author/all");
  }

  /**
   * Search authors by name
   * @param criteria 
   */
  search(criteria: string){
    if(!criteria){
      return this.get();
    }
    return this.http.get(environment.api.author+"/author/search/"+criteria);
  }

  /**
   * Update one author
   * @param author 
   */
  update(author: Author){
    this.http.post(environment.api.author+"/author/update/"+author._id,{author: author})
    .subscribe((data)=>{
      return data;
    });
  }

  /**
   * Add new author
   */
  add(author: Author){
    return this.http.post(environment.api.author+"/author/add",{author: author});
  }
  
  /**
   * Author Id
   * @param authorId 
   */
  remove(authorId: string){
    return this.http.post(environment.api.author+"/author/remove/"+authorId,{});
  }
}
