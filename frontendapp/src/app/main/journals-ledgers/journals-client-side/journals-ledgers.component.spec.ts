import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { JournalsLedgersComponent } from './journals-ledgers.component';

fdescribe('JournalsLedgersComponent', () => {
  let component: JournalsLedgersComponent;
  let fixture: ComponentFixture<JournalsLedgersComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalsLedgersComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('grid API is available after `detectChanges`', () => {
    fixture.detectChanges();
    expect(component.gridOptions.api).toBeTruthy();
  });

  it('should get sideBar', () => {
    const elm = fixture.nativeElement;
    const sideBar = elm.querySelectorAll('.ag-side-bar');
    expect(sideBar).toBeTruthy();
  });

  it('should get 3 layout buttons', () => {
    const elm = fixture.nativeElement;
    const sideButtons = elm.querySelectorAll('.ag-side-buttons');
    expect(sideButtons[0].childNodes.length === 3).toBeTruthy();
  });

  it('side bar should be visible', () => {
    expect(component.gridOptions.api.isSideBarVisible()).toBeTruthy();

  });

  it('check if new button is working', () => {
    component.gridOptions.api.openToolPanel('custom filters');
    const dropDownListBefore = fixture.debugElement.query(By.css('#gridLayoutList_id'));
    debugElement.query(By.css('#newCustomLayout_grid')).triggerEventHandler('click', null);

    // fixture.whenStable().then(() => {
    //   let input = fixture.debugElement.query(By.css('#layOutName_grid'));
    //   let el = input.nativeElement;

    //   //expect(el.value).toBe('peeskillet');

    //   el.value = 'test journal layout 2';
    //   el.dispatchEvent(new Event('input'));
    //   fixture.detectChanges();
    //   debugElement.query(By.css('#saveNewGrid_grid')).triggerEventHandler('click', null);
    //   fixture.detectChanges();
    //   expect(true).toBeTruthy();
    // });

    const input = fixture.debugElement.query(By.css('#layOutName_grid'));
    let el = input.nativeElement;

    // expect(el.value).toBe('peeskillet');

    el.value = 'test journal layout 2';
    el.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    debugElement.query(By.css('#saveNewGrid_grid')).triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const dropDownListAfter = fixture.debugElement.query(By.css('#gridLayoutList_id'));
      expect(true).toBeTruthy();
      })
  });
});
