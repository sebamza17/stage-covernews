import { Component, OnInit, EventEmitter } from '@angular/core';
import { auth } from 'firebase';
import { UserService} from './shared/user/user.service';
import { User } from './shared/user/User';
import { UserDataService } from './shared/user/user-data.service';
import { InitService } from './init/init.service';
import { ModalService } from './components/modal/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  constructor(
    public userSvc: UserService,
    public userData: UserDataService,
    private inits: InitService,
    public modalSvc: ModalService
  ) {
  }

  ngOnInit() {

    this.inits.init();

    auth().onAuthStateChanged((user) => {
      if (!user) {
        // TODO: Manage logout
        return;
      }
      this.userSvc.user = user as User;
      this.userSvc.authUser(() => {
        this.userSvc.event.emit(user);
        this.userData.walkUserData();
      });
    });
  }

  closeModal(id: string) {
    this.modalSvc.close(id);
  }
}
