import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDepreciationTableComponent } from './asset-depreciation-table.component';

describe('AssetDepreciationTableComponent', () => {
  let component: AssetDepreciationTableComponent;
  let fixture: ComponentFixture<AssetDepreciationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDepreciationTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDepreciationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
