import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevaluationEnteriesComponent } from './revaluation-enteries.component';

describe('RevaluationEnteriesComponent', () => {
  let component: RevaluationEnteriesComponent;
  let fixture: ComponentFixture<RevaluationEnteriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevaluationEnteriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevaluationEnteriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
