import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-department-list',
  template: `
    <p>department-list works!</p>
    <ul class="items">
      <li
        (click)="onSelect(department)"
        [class.selected]="isSelected(department)"
        *ngFor="let department of departments"
      >
        <span class="badge">{{ department.id }}</span>
        {{ department.name }}
      </li>
    </ul>
  `,
  styles: [],
})
export class DepartmentListComponent implements OnInit {
  public selectedId;
  departments = [
    {
      id: 1,
      name: 'Angular',
    },
    {
      id: 2,
      name: 'JSON',
    },
    {
      id: 3,
      name: 'Ruby',
    },
    {
      id: 4,
      name: 'React',
    },
    {
      id: 5,
      name: 'Angela',
    },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = parseInt(params.get('id'));
      this.selectedId = id;
    });
  }
  onSelect(department) {
    // this.router.navigate(['/department', department.id]);

    // Relative navigation
    this.router.navigate([department.id], { relativeTo: this.route });
  }
  isSelected(department) {
    return department.id === this.selectedId;
  }
}
