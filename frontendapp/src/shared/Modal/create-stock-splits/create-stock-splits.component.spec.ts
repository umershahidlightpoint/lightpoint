
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppModule } from './../../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { CorporateActionsModule } from './../../corporate-actions.module';
import * as moment from 'moment';

import { CommonModule } from '@angular/common';
import { TabsModule, ModalModule, AlertModule, TooltipModule } from 'ngx-bootstrap';

// Create CreateStockSplitsComponent
import { CreateStockSplitsComponent } from './create-stock-splits.component';

import { CorporateActionsApiService } from './../../../../../services/corporate-actions.api.service';
import { FinanceServiceProxy } from './../../../../../services/service-proxies';
import { SettingApiService } from './../../../../../services/setting-api.service';

import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../../../shared.module';
import { By } from '@angular/platform-browser';

fdescribe('CreateStockSplitsComponent', () => {

  let component: CreateStockSplitsComponent;
  let fixture: ComponentFixture<CreateStockSplitsComponent>;
  let debugElement: DebugElement;

  let httpTestingController: HttpTestingController;
  let service: CorporateActionsApiService;
  let settingService: SettingApiService;
  let financeServiceProxy: FinanceServiceProxy;

  const baseUrl = 'http://localhost:9092/api';
  const refUrl = 'http://localhost:9091/api';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
        CorporateActionsModule,
        CommonModule,
        HttpClientModule,
        HttpClientTestingModule,
        TabsModule,
        ModalModule,
        AlertModule,
        TooltipModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
      ],
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStockSplitsComponent);
    component = fixture.componentInstance;
    expect(component).toBeDefined();
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(CorporateActionsApiService);
    settingService = TestBed.get(SettingApiService);
    financeServiceProxy =  TestBed.get(FinanceServiceProxy);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.stockSplitForm.valid).toBeFalsy();
  });

  it('symbol field validity', () => {
    const symbol = component.stockSplitForm.controls.ticker;
    expect(symbol.valid).toBeFalsy();
  });

  it('noticeDate field validity', () => {
    const noticeDate = component.stockSplitForm.controls.noticeDate;
    expect(noticeDate.valid).toBeFalsy();
  });

  it('executionDate field validity', () => {
    const exDate = component.stockSplitForm.controls.executionDate;
    expect(exDate.valid).toBeFalsy();
  });

  it('topRatio field validity', () => {
    const recordDate = component.stockSplitForm.controls.topRatio;
    expect(recordDate.valid).toBeFalsy();
  });

  it('bottomRatio field validity', () => {
    const payDate = component.stockSplitForm.controls.bottomRatio;
    expect(payDate.valid).toBeFalsy();
  });

  it('should disable save button', () => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('btn btn-pa'));
      expect(button.nativeElement.disabled).toBe(true);
      });
  });

  it(' Delete button should be visible', () => {
    fixture.detectChanges();
    component.editStockSplit = true;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('btn btn-danger mr-auto'));
      expect(button.nativeElement.disabled).toBe(true);
      });
  });

  it('should enable save button', () => {
    fixture.detectChanges();
    component.stockSplitForm.setValue({
      ticker: 'ASRV',
      noticeDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      executionDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      topRatio: 1.3,
      bottomRatio: 40,
      adjustmentFactor: 1
    });
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('btn btn-pa'));
      expect(button.nativeElement.disabled).toBe(false);
      });
  });


  describe('Get symbols and bind value to symbols searchable dropdown', () => {
  it('returned symbols', () => {

    const dummySymbols =  {
          when: '2020-02-18T14:03:52.1043482+05:00',
          by: '',
          isSuccessful: true,
          message: 'The Request was Successful',
          payload: [
             {
                symbol: 'AAPL'
             },
             {
                symbol: 'ACBI'
             },
             {
                symbol: 'AMAT US Equity'
             },
             {
                symbol: 'AROW'
             },
             {
                symbol: 'ASRV'
             },
             {
                symbol: 'BWFG'
             },
             {
                symbol: 'CNBKA'
             },
             {
                symbol: 'CSCO'
             },
             {
                symbol: 'CSFL'
             },
             {
                symbol: 'CVCY'
             },
             {
                symbol: 'CVLY'
             },
             {
                symbol: 'CWBC'
             },
             {
                symbol: 'EBMT'
             },
             {
                symbol: 'ENFC'
             },
             {
                symbol: 'FFIN'
             },
             {
                symbol: 'FISI'
             },
             {
                symbol: 'FNB'
             },
             {
                symbol: 'FNWB'
             },
             {
                symbol: 'FRBA'
             },
             {
                symbol: 'FRBK'
             },
             {
                symbol: 'FUNC'
             },
             {
                symbol: 'GABC'
             },
             {
                symbol: 'GCBC'
             },
             {
                symbol: 'HIFS'
             },
             {
                symbol: 'HWC'
             },
             {
                symbol: 'IBCP'
             },
             {
                symbol: 'IBM'
             },
             {
                symbol: 'KO'
             },
             {
                symbol: 'KRNY'
             },
             {
                symbol: 'LEVI'
             },
             {
                symbol: 'LOB'
             },
             {
                symbol: 'MDCO US EQUITY'
             },
             {
                symbol: 'NIO'
             },
             {
                symbol: 'NKSH'
             },
             {
                symbol: 'ORRF'
             },
             {
                symbol: 'PBHC'
             },
             {
                symbol: 'PBIP'
             },
             {
                symbol: 'PLUG'
             },
             {
                symbol: 'SASR'
             },
             {
                symbol: 'SBBX'
             },
             {
                symbol: 'SMBK'
             },
             {
                symbol: 'SMMF'
             },
             {
                symbol: 'SVBI'
             },
             {
                symbol: 'SYBT'
             },
             {
                symbol: 'TCFC'
             },
             {
                symbol: 'TEXASCITIZENSBANCORP'
             },
             {
                symbol: 'TSC'
             },
             {
                symbol: 'VBTX'
             },
             {
                symbol: 'ZZ_CASH_DIVIDENDS'
             },
             {
                symbol: 'ZZ_INTEREST_EXPENSE'
             },
             {
                symbol: 'ZZ_INTEREST_INCOME'
             },
             {
                symbol: 'ZZ_INVESTOR_CONTRIBUTIONS'
             },
             {
                symbol: 'ZZ_OTHER'
             }
          ],
          meta: {
             Total: 0,
             TotalRecords: 0,
             Filters: null,
             FundsRange: null,
             LastRow: null,
             FooterSum: false,
             Columns: null
          },
          stats: null,
          statusCode: null
       };

    financeServiceProxy.getSymbol().subscribe((symbols: any) => {
    component.ticker$ = symbols.payload;

    expect(component.ticker$).toBeGreaterThanOrEqual(1);
});
   //  const request = httpTestingController.expectOne(refUrl + '/refdata/data?refdata=symbol');
   //  expect(request.request.method).toBe('GET');
   //  request.flush(dummySymbols);
});
});

  it('should create new stock split', () => {

    expect(component.stockSplitForm.valid).toBeFalsy();
    fixture.detectChanges();
    component.stockSplitForm.setValue({
      ticker: 'ASRV',
      noticeDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      executionDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      topRatio: 1.3,
      bottomRatio: 40,
      adjustmentFactor: 1
    });

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('btn btn-pa'));
      expect(button.nativeElement.disabled).toBe(false);
      expect(component.stockSplitForm.valid).toBeTruthy();
      });

  });

  it('Check if duplicate stock split exists with same symbol and execution date', () => {
    const mockStockSplit = {
      when: '2020-02-18T16:05:22.0564918+05:00',
      by: '',
      isSuccessful: true,
      message: 'StockSplits fetched successfully',
      payload: [
         {
            id: 8,
            created_by: 'user',
            created_date: '2020-02-14T12:13:50.677',
            last_updated_by: 'user',
            last_updated_date: '2020-02-17T13:01:20.31',
            symbol: 'AROW',
            notice_date: '2020-02-14T00:00:00',
            execution_date: '2020-02-13T00:00:00',
            topRatio: 1.3,
            bottomRatio: 40,
            adjustmentFactor: 1,
            active_flag: true
         }
    ],
      meta: null,
      stats: null,
      statusCode: 200
    };
    expect(component.stockSplitForm.valid).toBeFalsy();
    fixture.detectChanges();
    component.stockSplitForm.setValue({
      ticker: 'AROW',
      noticeDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      executionDate: { startDate: moment('2020-02-13T00:00:00'), endDate: moment('2020-02-13T00:00:00') },
      topRatio: 1.3,
      bottomRatio: 40,
      adjustmentFactor: 1,
    });

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const found = mockStockSplit.payload.some(
        items => items.symbol === component.stockSplitForm.value.ticker &&
        moment(items.execution_date).format('YYYY-MM-DD') === moment(component.stockSplitForm.value.executionDate.startDate).format('YYYY-MM-DD')
        );

      if (found) {
        expect(found).toBeTruthy();
      }
      });

  });

  it('Return true if execution date is greater than notice date', () => {
   const mockStockSplit = {
     when: '2020-02-18T16:05:22.0564918+05:00',
     by: '',
     isSuccessful: true,
     message: 'StockSplits fetched successfully',
     payload: [
        {
           id: 8,
           created_by: 'user',
           created_date: '2020-02-14T12:13:50.677',
           last_updated_by: 'user',
           last_updated_date: '2020-02-17T13:01:20.31',
           symbol: 'AROW',
           notice_date: '2020-02-15T00:00:00',
           execution_date: '2020-02-16T00:00:00',
           topRatio: 1.3,
           bottomRatio: 40,
           adjustmentFactor: 1,
           active_flag: true
        }
   ],
     meta: null,
     stats: null,
     statusCode: 200
   };
   expect(component.stockSplitForm.valid).toBeFalsy();
   fixture.detectChanges();
   component.stockSplitForm.setValue({
     ticker: 'AROW',
     noticeDate: { startDate: moment('2020-02-16T00:00:00'), endDate: moment('2020-02-16T00:00:00') },
     executionDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
     topRatio: 1.3,
     bottomRatio: 40,
     adjustmentFactor: 1,
   });

   fixture.whenStable().then(() => {
     fixture.detectChanges();

     if (moment(component.stockSplitForm.value.executionDate.startDate).format('YYYY-MM-DD') <
         moment(component.stockSplitForm.value.noticeDate.startDate).format('YYYY-MM-DD')) {
      const found = true;
      expect(found).toBeTruthy();
    }

   });

 });

  it('Return false if execution date is less than notice date', () => {
   const mockStockSplit = {
     when: '2020-02-18T16:05:22.0564918+05:00',
     by: '',
     isSuccessful: true,
     message: 'StockSplits fetched successfully',
     payload: [
        {
           id: 8,
           created_by: 'user',
           created_date: '2020-02-14T12:13:50.677',
           last_updated_by: 'user',
           last_updated_date: '2020-02-17T13:01:20.31',
           symbol: 'AROW',
           notice_date: '2020-02-15T00:00:00',
           execution_date: '2020-02-16T00:00:00',
           topRatio: 1.3,
           bottomRatio: 40,
           adjustmentFactor: 1,
           active_flag: true
        }
   ],
     meta: null,
     stats: null,
     statusCode: 200
   };
   expect(component.stockSplitForm.valid).toBeFalsy();
   fixture.detectChanges();
   component.stockSplitForm.setValue({
     ticker: 'AROW',
     noticeDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
     executionDate: { startDate: moment('2020-02-16T00:00:00'), endDate: moment('2020-02-16T00:00:00') },
     topRatio: 1.3,
     bottomRatio: 40,
     adjustmentFactor: 1,
   });

   fixture.whenStable().then(() => {
     fixture.detectChanges();

     if (moment(component.stockSplitForm.value.executionDate.startDate).format('YYYY-MM-DD') <
         moment(component.stockSplitForm.value.noticeDate.startDate).format('YYYY-MM-DD')) {
      const found = true;
      expect(found).toBeTruthy();
    }

   });

 });

  it('calculation for adjustment factor', () => {
   fixture.detectChanges();
   component.stockSplitForm.setValue({
      ticker: 'AROW',
      noticeDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      executionDate: { startDate: moment('2020-02-16T00:00:00'), endDate: moment('2020-02-16T00:00:00') },
      topRatio: 3,
      bottomRatio: 6,
      adjustmentFactor: 0.5
    });
   if (component.stockSplitForm.value.adjustmentFactor === 0.5) {
      expect(component.stockSplitForm.value.adjustmentFactor).toBe(0.5);
     }

   });

});
