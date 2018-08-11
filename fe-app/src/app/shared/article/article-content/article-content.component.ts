import { Component, Input, OnInit, ViewEncapsulation, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-article-content',
  template: '<div class="article-content" [ngClass]="{\'article-content--clean\': isCleanText}" [innerHTML]="articleContent | safeHtml"></div>',
  styleUrls: ['./article-content.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleContentComponent implements OnInit {
  @Input() articleContent: string;
  @Input() isCleanText: boolean;

  constructor() {
    
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // If lazyLoad option is enabled, only load when loadFlag changes to true, start init process
    if (changes['articleContent'] && changes['articleContent'].currentValue) {
      this.parseContent();
    }
  }

  parseContent(){
    if(!this.articleContent){
      return;
    }
    if(this.articleContent.indexOf('{"content":"') !== -1){
      this.articleContent = this.articleContent.replace('{"content":"','');
    }
    if(this.articleContent.indexOf('}') !== -1){
      this.articleContent = this.articleContent.replace('{"content":"','');
    }
    this.articleContent = this.articleContent.replace('}','');
    console.log(this.articleContent);
  }
}
