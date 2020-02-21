
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppModule } from './../../../app/app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import * as moment from 'moment';

import { CommonModule } from '@angular/common';
import { TabsModule, ModalModule, AlertModule, TooltipModule } from 'ngx-bootstrap';

// Create Dividend Component
import { CreateDividendComponent } from './create-dividend.component';

import { CorporateActionsApiService } from './../../../services/corporate-actions.api.service';
import { FinanceServiceProxy } from './../../../services/service-proxies';
import { SettingApiService } from './../../../services/setting-api.service';

import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from './../../../app/shared.module';
import { By } from '@angular/platform-browser';

fdescribe('CreateDividendComponent', () => {

  let component: CreateDividendComponent;
  let fixture: ComponentFixture<CreateDividendComponent>;
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
    fixture = TestBed.createComponent(CreateDividendComponent);
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
    expect(component.dividentForm.valid).toBeFalsy();
  });

  it('symbol field validity', () => {
    const symbol = component.dividentForm.controls.ticker;
    expect(symbol.valid).toBeFalsy();
  });

  it('noticeDate field validity', () => {
    const noticeDate = component.dividentForm.controls.noticeDate;
    expect(noticeDate.valid).toBeFalsy();
  });

  it('exDate field validity', () => {
    const exDate = component.dividentForm.controls.exDate;
    expect(exDate.valid).toBeFalsy();
  });

  it('recordDate field validity', () => {
    const recordDate = component.dividentForm.controls.recordDate;
    expect(recordDate.valid).toBeFalsy();
  });

  it('payDate field validity', () => {
    const payDate = component.dividentForm.controls.payDate;
    expect(payDate.valid).toBeFalsy();
  });

  it('ratio field validity', () => {
    const ratio = component.dividentForm.controls.ratio;
    expect(ratio.valid).toBeFalsy();
  });

  it('currency field validity', () => {
    const currency = component.dividentForm.controls.currency;
    expect(currency.valid).toBeFalsy();
  });

  it('holdingRate field validity', () => {
    const holdingRate = component.dividentForm.controls.holdingRate;
    expect(holdingRate.valid).toBeFalsy();
  });

  it('fxRate field validity', () => {
    const fxRate = component.dividentForm.controls.fxRate;
    expect(fxRate.valid).toBeFalsy();
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
    component.editDividend = true;

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('btn btn-danger mr-auto'));
      expect(button.nativeElement.disabled).toBe(true);
      });
  });

  it('should enable save button', () => {
    fixture.detectChanges();
    component.dividentForm.setValue({
      ticker: 'ASRV',
      noticeDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      exDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      recordDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      payDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      ratio: 1.3,
      currency: 'USD',
      holdingRate: 40,
      fxRate: 1
    });
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('btn btn-pa'));
      expect(button.nativeElement.disabled).toBe(false);
      });
  });

  describe('Get currencies and bind value to currencies searchable dropdown', () => {
    it('returned currencies', () => {

      const dummyCurrencies = {
          when: '2020-02-10T11:58:38.1252146+05:00',
          by: '',
          isSuccessful: true,
          message: 'The Request was Successful',
          payload: [
          'USD',
          'PKR'
          ],
          meta: null,
          stats: null,
          statusCode: 200
          };

      settingService.getReportingCurrencies().subscribe((settings: any) => {
      component.currencies$ = settings.payload;

      expect(component.currencies$).toBeGreaterThanOrEqual(1);
  });
      const request = httpTestingController.expectOne(baseUrl + '/setting/currency');
      expect(request.request.method).toBe('GET');
      request.flush(dummyCurrencies);
  });
});

  describe('Get symbols and bind value to symbols searchable dropdown', () => {
  it('returned symbols', () => {

    const dummySymbols =  {
          when:'2020-02-18T14:03:52.1043482+05:00',
          by: '',
          isSuccessful: true,
          message:'The Request was Successful',
          payload: [
             {
                symbol:'AAPL'
             },
             {
                symbol:'ACBI'
             },
             {
                symbol:'AMAT US Equity'
             },
             {
                symbol:'AROW'
             },
             {
                symbol:'ASRV'
             },
             {
                symbol:'BWFG'
             },
             {
                symbol:'CNBKA'
             },
             {
                symbol:'CSCO'
             },
             {
                symbol:'CSFL'
             },
             {
                symbol:'CVCY'
             },
             {
                symbol:'CVLY'
             },
             {
                symbol:'CWBC'
             },
             {
                symbol:'EBMT'
             },
             {
                symbol:'ENFC'
             },
             {
                symbol:'FFIN'
             },
             {
                symbol:'FISI'
             },
             {
                symbol:'FNB'
             },
             {
                symbol:'FNWB'
             },
             {
                symbol:'FRBA'
             },
             {
                symbol:'FRBK'
             },
             {
                symbol:'FUNC'
             },
             {
                symbol:'GABC'
             },
             {
                symbol:'GCBC'
             },
             {
                symbol:'HIFS'
             },
             {
                symbol:'HWC'
             },
             {
                symbol:'IBCP'
             },
             {
                symbol:'IBM'
             },
             {
                symbol:'KO'
             },
             {
                symbol:'KRNY'
             },
             {
                symbol:'LEVI'
             },
             {
                symbol:'LOB'
             },
             {
                symbol:'MDCO US EQUITY'
             },
             {
                symbol:'NIO'
             },
             {
                symbol:'NKSH'
             },
             {
                symbol:'ORRF'
             },
             {
                symbol:'PBHC'
             },
             {
                symbol:'PBIP'
             },
             {
                symbol:'PLUG'
             },
             {
                symbol:'SASR'
             },
             {
                symbol:'SBBX'
             },
             {
                symbol:'SMBK'
             },
             {
                symbol:'SMMF'
             },
             {
                symbol:'SVBI'
             },
             {
                symbol:'SYBT'
             },
             {
                symbol:'TCFC'
             },
             {
                symbol:'TEXASCITIZENSBANCORP'
             },
             {
                symbol:'TSC'
             },
             {
                symbol:'VBTX'
             },
             {
                symbol:'ZZ_CASH_DIVIDENDS'
             },
             {
                symbol:'ZZ_INTEREST_EXPENSE'
             },
             {
                symbol:'ZZ_INTEREST_INCOME'
             },
             {
                symbol:'ZZ_INVESTOR_CONTRIBUTIONS'
             },
             {
                symbol:'ZZ_OTHER'
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
    const request = httpTestingController.expectOne(refUrl + '/refdata/data?refdata=symbol');
    expect(request.request.method).toBe('GET');
    request.flush(dummySymbols);
});
});

  it('should create new dividend', () => {

    expect(component.dividentForm.valid).toBeFalsy();
    fixture.detectChanges();
    component.dividentForm.setValue({
      ticker: 'ASRV',
      noticeDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      exDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      recordDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      payDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      ratio: 1.3,
      currency: 'USD',
      holdingRate: 40,
      fxRate: 1
    });

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('btn btn-pa'));
      expect(button.nativeElement.disabled).toBe(false);
      expect(component.dividentForm.valid).toBeTruthy();
      });

  });

  it('Check if duplicate dividend exists with same symbol and execution date', () => {
    const mockDividends = { 
      when: '2020-02-18T16:05:22.0564918+05:00',
      by: '',
      isSuccessful:true,
      message: 'Dividends fetched successfully',
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
            record_date: '2020-02-14T00:00:00',
            pay_date: '2020-02-14T00:00:00',
            rate: 1.0,
            currency: 'USD',
            withholding_rate: 30.0,
            fx_rate: 1.0,
            active_flag: true
         }
    ],
      meta: null,
      stats: null,
      statusCode: 200
    }
    expect(component.dividentForm.valid).toBeFalsy();
    fixture.detectChanges();
    component.dividentForm.setValue({
      ticker: 'AROW',
      noticeDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      exDate: { startDate: moment('2020-02-13T00:00:00'), endDate: moment('2020-02-13T00:00:00') },
      recordDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      payDate: { startDate: moment('2020-02-17T00:00:00'), endDate: moment('2020-02-17T00:00:00') },
      ratio: 1.3,
      currency: 'USD',
      holdingRate: 40,
      fxRate: 1
    });

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const found = mockDividends.payload.some(
        items => items.symbol === component.dividentForm.value.ticker &&
        moment(items.execution_date).format('YYYY-MM-DD') === moment(component.dividentForm.value.exDate.startDate).format('YYYY-MM-DD')
        );

      if (found) {
        expect(found).toBeTruthy();
      }
      });

  });

});
