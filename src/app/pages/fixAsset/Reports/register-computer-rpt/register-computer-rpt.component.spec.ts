import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComputerRptComponent } from './register-computer-rpt.component';

describe('RegisterComputerRptComponent', () => {
  let component: RegisterComputerRptComponent;
  let fixture: ComponentFixture<RegisterComputerRptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterComputerRptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComputerRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
