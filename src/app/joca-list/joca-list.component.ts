import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AgeValidator } from './age.validators';

@Component({
  selector: 'app-joca-list',
  templateUrl: './joca-list.component.html',
  styleUrls: ['./joca-list.component.css'],
})
export class JocaListComponent implements OnInit {
  public employees = [
    { id: 1, name: 'Andrew', age: 35 },
    { id: 2, name: 'Jenny', age: 23 },
    { id: 3, name: 'Blessing', age: 55 },
    { id: 4, name: 'Stefan', age: 14 },
    { id: 5, name: 'Elena', age: 23 },
  ];

  constructor(public fb: FormBuilder) {}
  validatorForm = this.fb.group({
    name: ['', [Validators.required, AgeValidator]],
  });
  get name() {
    return this.validatorForm.get('name');
  }
  // onSubmit() {
  //   if (!this.validatorForm.valid) {
  //     alert('Please enter your age!');
  //     return false;
  //   } else {
  //     alert(JSON.stringify(this.validatorForm.valid));
  //   }
  // }

  ngOnInit(): void {}
}
