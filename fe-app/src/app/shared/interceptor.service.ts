import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { UserService } from './user/user.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  constructor(public userSvc: UserService) {}

  /**
   * Intercept request to the lambda, sending token
   * @param request 
   * @param next 
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    let token = '';
    if(this.userSvc.user && this.userSvc.user.refreshToken){
      token = this.userSvc.user.refreshToken;
      request = request.clone({ 
        headers: request.headers.set('Token', token) 
      });
    }

    return next.handle(request);
  }
}