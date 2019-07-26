import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureHolderComponent } from './feature-holder.component';

describe('FeatureHolderComponent', () => {
  let component: FeatureHolderComponent;
  let fixture: ComponentFixture<FeatureHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureHolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
