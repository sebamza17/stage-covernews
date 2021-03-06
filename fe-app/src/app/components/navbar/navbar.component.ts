import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user/user.service';
import { Globals } from '../../globals';

@Component({
  selector: 'ui-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {

  public status: Boolean = false;

  constructor(
    public globals: Globals,
    private user: UserService
  ) {
  }

  public toggle() {
    this.status = !this.status;
  }

  ngOnInit() {
  }

  /**
   * Login action
   */
  onLogin() {
    this.user.socialLogin('facebook')
      .then((data) => {
        var user = <any>data;

        // Set values on globals
        this.globals.setValue('user', 'user', {
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          photoUrl: user.photoUrl,
          refreshToken: user.refreshToken,
          uid: user.uid,
        });
        this.globals.setValue('user', 'isLoggedIn', true);
      })
      .catch((error) => {
        console.log(error);
        console.log('Login: Failed');
      });
  }

  /**
   * Logout action
   */
  onLogout() {
    this.user.logout();
    this.globals.setValue('user', 'isLoggedIn', false);
  }
}
