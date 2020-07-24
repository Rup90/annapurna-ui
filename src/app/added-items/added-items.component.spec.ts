import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedItemsComponent } from './added-items.component';

describe('AddedItemsComponent', () => {
  let component: AddedItemsComponent;
  let fixture: ComponentFixture<AddedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
