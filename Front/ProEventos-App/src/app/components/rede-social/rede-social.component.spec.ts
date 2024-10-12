/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RedeSocialComponent } from './rede-social.component';

describe('RedeSocialComponent', () => {
  let component: RedeSocialComponent;
  let fixture: ComponentFixture<RedeSocialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeSocialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
