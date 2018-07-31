import { Component, Input } from '@angular/core';
import { ArticleBaseComponent } from '../article-base/article-base.component';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.less']
})
export class ArticleCardComponent extends ArticleBaseComponent {
  @Input() showCategory: boolean;
  @Input() isTransparent: boolean;

  ngOnInit() {
    if (this.showCategory) {
      this.getCategory();
    }
    this.checkIfIsReadLaterList();
  }

}
