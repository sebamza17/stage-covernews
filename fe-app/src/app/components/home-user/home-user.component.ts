import { Component, OnInit, NgZone } from '@angular/core';
import { AuthorService } from '../../shared/author/author.service';
import { UserService } from '../../shared/user/user.service';
import { Author } from '../../shared/author/Author';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css']
})
export class HomeUserComponent implements OnInit {

  public authors: Author[];
  public test = null;

  constructor(
    private _ngZone: NgZone, 
    public authorSvc: AuthorService, 
    public userSvc: UserService) { }

  ngOnInit() {
    this.userSvc.event.subscribe((item)=>{  
      this._ngZone.run(() =>{
        this.getFollowAuthors();
      }); 
    });
  }

  /**
   * Get All Authors that the user follow
   */
  public getFollowAuthors(){
    this.authorSvc.getFollowAuthors()
    .subscribe(data=>{
      this.authors = data;
      console.log(this.authors);
    })
  }
}
