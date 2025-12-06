import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialLoad } from './initial-load';

describe('InitialLoad', () => {
  let component: InitialLoad;
  let fixture: ComponentFixture<InitialLoad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialLoad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitialLoad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
