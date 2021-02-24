import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  @Input('joca') public name;
  @Output() public childEvent = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  fireEvent() {
    this.childEvent.emit('Hello titan coders');
  }
}
