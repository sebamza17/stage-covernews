import { Component, OnInit, EventEmitter } from '@angular/core';
import { auth } from 'firebase';
import { UserService } from './shared/user/user.service'
import { User } from './shared/user/User';
import { UserDataService } from './shared/user/user-data.service';
import { Globals } from './globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  constructor(
    public userSvc: UserService,
    public userData: UserDataService,
    private globals: Globals
  ) {
  }

  ngOnInit() {

    this.globals.init();

    auth().onAuthStateChanged((user) => {

      if (!user) {
        //TODO: Manage logout
        return;
      }
      this.userSvc.user = user as User;
      this.userSvc.registerUserToken(user.refreshToken, () => {
        this.userSvc.event.emit(user);
        this.userData.walkUserData();
      });
    });
  }

}
