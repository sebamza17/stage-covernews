import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Article } from '../Article';
import { ArticleBaseComponent } from '../article-base/article-base.component';

@Component({
  selector: 'app-article-card-horizontal',
  templateUrl: './article-card-horizontal.component.html',
  styleUrls: ['./article-card-horizontal.component.less']
})
export class ArticleCardHorizontalComponent extends ArticleBaseComponent implements OnInit {
  @Input() article: Article;
  @Input() isGiant: boolean;
  @Input() loadDetails: boolean;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // If lazyLoad option is enabled, only load when loadFlag changes to true, start init process
    if (this.loadDetails && changes['article'] && <Article>changes['article'].currentValue._id) {
      this.getDetails();
    }
  }

  private async getDetails() {
    this.article.content = '██████ ███ █████████ ██████ ████████████ ███ ██ ██████ ██ ██████ ████ ████████ ██ ██'
    const articleDetails = await this.articleService.getArticleFullById(this.article._id);
    this.article = articleDetails;
  }

}
