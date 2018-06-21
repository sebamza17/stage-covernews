import { Injectable } from '@angular/core';
import BaseService from '../base-service/base.service';
import { User } from './User';
import { AuthorFollowing } from './AuthorFollowing';
import { CategoryFollowing } from './CategoryFollowing';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService extends BaseService {

  user: User;
  authorFollowing: AuthorFollowing[];
  categoryFollowing: CategoryFollowing[];

  constructor(public userSvc: UserService) { 
    super();

    this.user = this.userSvc.user;
  }

  /**
   * Walk througt all data from user
   */
  public walkUserData(){
    //TODO: Get all data from 

    this.getFollowingAuthors();
    this.getSuggestedAuthors();
    this.getFollowingCategories();
    this.getSuggestCategories();
    this.getStatusAccount();
  }

  /* PRIVATE SECTION */

  private getFollowingAuthors(){}
  private getFollowingCategories(){}
  private getSuggestedAuthors(){}
  private getSuggestCategories(){}
  private getStatusAccount(){}
  

}
