import { Injectable } from '@angular/core';
import { Globals } from '../globals';
import { AuthorService } from "../shared/author/author.service";

@Injectable({
  providedIn: 'root'
})
export class InitService {

  constructor(
    private globals: Globals,
    private authorService: AuthorService
  ) {
  }

  public init() {
    this.initGlobals();
  }

  /**
   * Init the global vars and LS with API data
   */
  private initGlobals() {
    this.globals.init().then(() => {
      // If user is logged in
      if (this.globals.user.user && this.globals.user.user.refreshToken) {
        // Get followed authors
        this.authorService.getFollowedAuthors().subscribe(authors => {
          this.globals.user.followedAuthors = authors;
        });
      }
    });
  }

}
