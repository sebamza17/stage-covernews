import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Article } from "../article/Article";
import { ArticleService } from "../article/article.service";

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.less']
})
export class SideMenuComponent implements OnInit {
  @Input() isOpen: boolean;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Input() lazyLoad: boolean;
  @Input() loadFlag: boolean;
  @Input() articles: Article[];

  public articleFilter: Article = new Article();

  private defaultArticleLimit: number = 5;
  private alreadyLoaded: boolean = false;

  public searchCriteria: string;

  /**
   * Toggles UI open/close
   */
  public toggle() {
    this.cleanFilter();
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  /**
   * Cleans the search filter
   */
  public cleanFilter() {
    this.articleFilter = new Article();
  }

  constructor(private articleService: ArticleService) {
  }

  ngOnInit() {
    this.articles = this.articleService.generatePlaceholders(this.defaultArticleLimit, {
      title: '██ ███ ██████',
      authorName: '██ ██████'
    });
    this.articleFilter.title = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    // If lazyLoad option is enabled, only load when loadFlag changes to true, start init process
    if (this.lazyLoad && !this.alreadyLoaded && changes['loadFlag'] && changes['loadFlag'].currentValue) {
      this.alreadyLoaded = true;
    }
  }

}
