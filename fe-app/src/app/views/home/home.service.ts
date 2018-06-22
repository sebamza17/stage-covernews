import { Injectable } from '@angular/core';
import BaseService from '../../shared/base-service/base.service';
import { CategoryService } from '../../shared/category/category.service';
import { Category } from '../../shared/category/Category';
import { Author } from '../../shared/author/Author';
import { AuthorService } from '../../shared/author/author.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseService {

  categories: Category[];
  banner: Object;
  authors: Author[];

  constructor(public categorySvc: CategoryService, public authorSvc: AuthorService) { 
    super();
  }


  public getBanner(){

  }

  public getSuggestedAuthors(){

  }

  public getCategories(){
    return this.categorySvc.getAllCategories();
  }

  public getAuthors(){
    return this.authorSvc.getAllAuthors();
  }

  public followAuthor(author: string){
    return this.authorSvc.followAuthor(author);
  }
}
