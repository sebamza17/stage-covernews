import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dictioz-features',
  templateUrl: './dictioz-features.component.html',
  styleUrls: ['./dictioz-features.component.less']
})
export class DictiozFeaturesComponent implements OnInit {
  @Input() isLoggedIn = false;

  public isOpen = false;

  constructor() {
  }

  ngOnInit() {
    if (!this.isLoggedIn) {
      setTimeout(() => {
        this.isOpen = true;
      }, 5000);
    }
  }

  public toggle() {
    this.isOpen = !this.isOpen;
  }

}
