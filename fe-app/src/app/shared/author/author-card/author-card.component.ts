import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Author } from '../Author';
import { AuthorService } from '../author.service';
import { Globals } from '../../../globals';

@Component({
  selector: 'app-author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.less']
})
export class AuthorCardComponent implements OnInit {
  @Input() author: Author;

  public followLoading = false;
  public userIsFollowing = false;

  constructor(
    private authorService: AuthorService,
    private globals: Globals,
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['author'] && changes['author'].currentValue && changes['author'].currentValue._id) {

      // Check if logged user is inside followed authors
      this.globals.getGroup('user')
        .then(userData => {
          console.log(userData);
          if (userData.isLoggedIn) {
            this.userIsFollowing = userData.followedAuthors.indexOf(this.author._id) > -1;
          }
        });
    }
  }


  /**
   * Follows this card author
   * @param $event
   */
  public follow($event) {
    $event.stopPropagation();
    if (!this.author || !this.author._id) {
      console.log('WARNING: No author / author ID');
      return;
    }

    // UI loading flag
    this.followLoading = true;

    // Toggle follow
    this.authorService.followAuthor(this.author)
      .then(result => {
        this.followLoading = false;
        this.userIsFollowing = result;
      });

    // This stops the propagation for this event
    return false;
  }

}
