import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ui-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {

  public status: Boolean = false;

  constructor() {
  }

  public toggle() {
    console.log(this.status);
    this.status = !this.status;
  };

  ngOnInit() {
  }

}
