import { Injectable } from '@angular/core';
import { User } from './User';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import BaseService from '../base-service/base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService{

  provider: any;
  user: User;

  urls = {
    token: '/user/refreshToken'
  };

  constructor(public fireAuth: AngularFireAuth, public http: HttpClient) { 
    super();
  }

  /**
   * Login or register with google or facebook
   * @param prov 
   */
  async socialLogin(prov: string) {

    if(prov === 'google'){
      this.provider = new auth.GoogleAuthProvider();
    }

    if(prov === 'facebook'){
      this.provider = new auth.FacebookAuthProvider();
    }

    return await this.loginWithProvider();
  }

  /**
   * Login witht email and password
   * @param email 
   * @param password 
   */
  async login(email: string, password: string){
    return await this.loginByEmail(email,password);
  }

  /**
   * Register by email and password
   * @param email 
   * @param password 
   */
  async register(email: string, password: string){
    return await this.registerByEmail(email,password);
  }

  /**
   * Log Out
   */
  logout() {
    this.fireAuth.auth.signOut();
  }

  /**
   * Login With Provider
   */
  private async loginWithProvider(){
    return await this.fireAuth.auth.signInWithPopup(this.provider)
    .then((result)=> {
      this.user = result.user;
      this.registerUserToken(this.user.refreshToken);
      return this.user;
    }).catch(function(error) {
      //TODO: Manage error of user authetication
    });;
  }

  /**
   * Login by Email
   * @param email 
   * @param password 
   */
  private async loginByEmail(email: string, password: string){
    return await auth().signInWithEmailAndPassword(email, password)
    .then((result)=>{
      this.user = result.user;
      this.registerUserToken(this.user.refreshToken);
      return this.user;
    })
    .catch((error)=>{
      //TODO: Manage error
    });
  }

  /**
   * Register by Email
   * @param email 
   * @param password 
   */
  private async registerByEmail(email: string, password: string){
    return await auth().createUserWithEmailAndPassword(email, password)
    .then((result)=>{
      this.user = result.user;
      this.registerUserToken(this.user.refreshToken);
      return this.user;
    })
    .catch((error)=>{
      //TODO: Manage error
    });
  }

  /**
   * Register user token
   * @param token 
   */
  public registerUserToken(token: string){
    this.http.post(this.url(this.urls.token),{user: this.user})
    .subscribe((data)=>{
      console.log(data);
    })
  }
}
