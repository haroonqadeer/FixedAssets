import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDepreciationComponent } from './asset-depreciation.component';

describe('AssetDepreciationComponent', () => {
  let component: AssetDepreciationComponent;
  let fixture: ComponentFixture<AssetDepreciationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetDepreciationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetDepreciationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
