import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user/user.service';
import { ModalService } from '../../components/modal/modal.service';

@Component({
  selector: 'ui-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {

  public status: Boolean = false;

  constructor(private user: UserService, public modalSvc: ModalService) {
  }

  public toggle() {
    console.log(this.status);
    this.status = !this.status;
  }

  ngOnInit() {
  }

  /**
   * Login action
   */
  onLogin() {
    const user = this.user.socialLogin('facebook');
    user.then((data) => {
      console.log(data);
    });
  }

  /**
   * Logout action
   */
  onLogout() {
    this.user.logout();
  }

  openModal(id: string) {
    this.modalSvc.open(id);
  }
}
