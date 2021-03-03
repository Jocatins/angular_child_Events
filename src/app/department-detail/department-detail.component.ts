import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-department-detail',
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.css'],
})
export class DepartmentDetailComponent implements OnInit {
  public departmentId;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // const id = parseInt(this.route.snapshot.paramMap.get('id'));
    // this.departmentId = id;
    this.route.paramMap.subscribe((param: ParamMap) => {
      const id = parseInt(param.get('id'));
      this.departmentId = id;
    });
  }
  goPrevious() {
    const previousId = this.departmentId - 1;
    this.router.navigate(['/department', previousId]);
  }
  goNext() {
    const nextId = this.departmentId + 1;
    this.router.navigate(['/department', nextId]);
  }
  goToDepartment() {
    const selectedId = this.departmentId ? this.departmentId : null;
    // this.router.navigate(['/department', { id: selectedId }]);
    this.router.navigate(['../', { id: selectedId }], {
      relativeTo: this.route,
    });
  }
}
