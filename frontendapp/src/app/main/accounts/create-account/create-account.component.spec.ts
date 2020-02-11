
import { ReactiveFormsModule } from '@angular/forms';
import { AppModule } from './../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { AccountsModule } from './../accounts.module';
import { APP_BASE_HREF } from '@angular/common';

// Create Account Component
import { CreateAccountComponent } from './create-account.component';

import { AccountApiService } from './../../../../services/account-api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { TabsModule } from 'ngx-bootstrap';
import { By } from '@angular/platform-browser';

fdescribe('CreateAccountComponent', () => {

  let component: CreateAccountComponent;
  let fixture: ComponentFixture<CreateAccountComponent>;
  let debugElement: DebugElement;

  let httpTestingController: HttpTestingController;
  let service: AccountApiService;
  const baseUrl = 'http://localhost:9092/api';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // declarations: [ CreateAccountComponent ],
      imports: [
        AppModule,
        AccountsModule,
        CommonModule,
        HttpClientModule,
        HttpClientTestingModule,
        TabsModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.accountForm.valid).toBeFalsy();
  });

  it('should disable save button', () => {
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css("dis-button"));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should enable save button', () => {
    fixture.detectChanges();
    component.accountForm.controls.description.setValue('This is description');
    component.accountForm.controls.type.setValue('Dummy Type');
    const button = fixture.debugElement.query(By.css("dis-button"));
    fixture.detectChanges();
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it('should create new account', () => {

    expect(component.accountForm.valid).toBeFalsy();
    fixture.detectChanges();
    component.accountForm.controls.description.setValue('This is description');
    component.accountForm.controls.type.setValue('Dummy Type');

    expect(component.accountForm.valid).toBeTruthy();

  });

});
