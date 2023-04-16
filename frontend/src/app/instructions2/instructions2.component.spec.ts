import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Instructions2Component } from './instructions2.component';

describe('Instructions2Component', () => {
  let component: Instructions2Component;
  let fixture: ComponentFixture<Instructions2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Instructions2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Instructions2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
