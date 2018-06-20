import { Component, OnInit } from '@angular/core';
import { auth } from 'firebase';
import { UserService} from './shared/user/user.service'
import { User } from './shared/user/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(public userSvc: UserService){}

  ngOnInit(){
    auth().onAuthStateChanged((user)=>{
      if(!user){
        //TODO: Manage logout
        return;
      }
      this.userSvc.user = user as User;
      this.userSvc.registerUserToken(user.refreshToken);
    });
  }
}
