import { Component, OnInit, EventEmitter } from '@angular/core';
import { auth } from 'firebase';
<<<<<<< HEAD
import { UserService} from './shared/user/user.service';
import { User } from './shared/user/User';
import { UserDataService } from './shared/user/user-data.service';
import { ModalService } from './components/modal/modal.service';
=======
import { UserService } from './shared/user/user.service'
import { User } from './shared/user/User';
import { UserDataService } from './shared/user/user-data.service';
import { Globals } from './globals';
>>>>>>> master

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

<<<<<<< HEAD
  constructor(public userSvc: UserService, public userData: UserDataService, public modalSvc: ModalService) {}

  ngOnInit() {
    auth().onAuthStateChanged((user) => {
      if (!user) {
        // TODO: Manage logout
=======
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
>>>>>>> master
        return;
      }
      this.userSvc.user = user as User;
      this.userSvc.registerUserToken(user.refreshToken, () => {
        this.userSvc.event.emit(user);
        this.userData.walkUserData();
      });
    });
  }

  closeModal(id: string) {
    this.modalSvc.close(id);
  }
}
