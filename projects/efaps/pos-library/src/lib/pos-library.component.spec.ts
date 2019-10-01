import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosLibraryComponent } from './pos-library.component';

describe('PosLibraryComponent', () => {
  let component: PosLibraryComponent;
  let fixture: ComponentFixture<PosLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
