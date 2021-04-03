import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalTransfersReportComponent } from './external-transfers-report.component';

describe('ExternalTransfersReportComponent', () => {
  let component: ExternalTransfersReportComponent;
  let fixture: ComponentFixture<ExternalTransfersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalTransfersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalTransfersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
