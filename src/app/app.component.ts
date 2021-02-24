import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'practice';
  public name = 'Titans';
  public messages = 'It is the big show';
  public message = '';
  public date = new Date();
  clickMe(evt) {
    console.log(evt);
  }
  public data = 'Jocatins';
}
