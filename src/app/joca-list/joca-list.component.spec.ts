import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JocaListComponent } from './joca-list.component';

describe('JocaListComponent', () => {
  let component: JocaListComponent;
  let fixture: ComponentFixture<JocaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JocaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JocaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
