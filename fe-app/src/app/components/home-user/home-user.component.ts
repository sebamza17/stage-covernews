import { Component, OnInit, NgZone } from '@angular/core';
import { AuthorService } from '../../shared/author/author.service';
import { UserService } from '../../shared/user/user.service';
import { MercadopagoService } from '../../shared/mercadopago/mercadopago.service';
import { Author } from '../../shared/author/Author';
import { Globals } from '../../globals';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  providers: [ MercadopagoService ],
  styleUrls: ['./home-user.component.css']
})
export class HomeUserComponent implements OnInit {

  public authors: Author[];
  public subscription;
  public test = null;

  constructor(
    private globals: Globals,
    private mercadopagoSvc: MercadopagoService,
    private _ngZone: NgZone,
    public authorSvc: AuthorService,
    public userSvc: UserService
  ) { }

  ngOnInit() {
    this.userSvc.event.subscribe((item) => {
      this._ngZone.run(() => {
        this.getFollowAuthors();
        this.getSubscription();
      });
    });
  }

  /**
   * Get All Authors that the user follow
   */
  public getFollowAuthors() {
    this.authorSvc.getFollowedAuthors()
    .subscribe(data => {
      this.authors = data;
      console.log(this.authors);
    });
  }

  public getSubscription() {
    this.mercadopagoSvc.getSubscription({ email: this.globals.user.user.email })
      .then((data) => {
        this.subscription = data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  public onUnsubscribe() {
    this.mercadopagoSvc.cancelSubscription({ email: this.globals.user.user.email })
      .then((response: any) => {
        // console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
