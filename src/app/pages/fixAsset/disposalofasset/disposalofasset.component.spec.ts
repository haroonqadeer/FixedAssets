import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisposalofassetComponent } from './disposalofasset.component';

describe('DisposalofassetComponent', () => {
  let component: DisposalofassetComponent;
  let fixture: ComponentFixture<DisposalofassetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisposalofassetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisposalofassetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
