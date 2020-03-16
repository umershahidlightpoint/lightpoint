import { TestBed } from '@angular/core/testing';
import { ReportsApiService } from './reports-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

fdescribe('ReportsService', () => {
  // We declare the variables that we'll use for the Test Controller and for our Service
  let httpTestingController: HttpTestingController;
  let service: ReportsApiService;
  const baseUrl = 'http://localhost:9092/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportsApiService],
      imports: [HttpClientTestingModule]
    });

    // We inject our service (which imports the HttpClient) and the Test Controller
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(ReportsApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // Latest Journal Date

  describe('Get Latest Journals Date URL: /journal/lastPostedDate', () => {
    it('returned latest journals date', () => {

        service.getLatestJournalDate().subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/lastPostedDate');
        expect(request.request.method).toBe('GET');
    });
  });

  // COST BASIS
  describe('Get CostBasis Report URL: /journal/costbasisReport?date=+date+&symbol=+symbol+&fund=+fund', () => {
    it('returned costbasis report', () => {

        const obj = {
            date: '2020-01-07',
            symbol: null,
            fund: null,
        }

        service.getCostBasisReport(obj.date, obj.symbol, obj.fund).subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/costbasisReport?date=' + obj.date + '&symbol=' + obj.symbol + '&fund=' + obj.fund);
        expect(request.request.method).toBe('GET');
    });
  });

  describe('Get CostBasisChart URL: /journal/costbasisChart?symbol= + ACBI', () => {
    it('returned costbasis report', () => {

        const obj = {
            symbol: 'ACBI',
        };

        service.getCostBasisChart(obj.symbol).subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/costbasisChart?symbol=' + obj.symbol);
        expect(request.request.method).toBe('GET');
    });
  });

  // Taxlots

  describe('Get Taxlots Report URL: /journal/costbasisChart?symbol= + ACBI', () => {
    it('returned taxlots report', () => {

        const obj = {
            fromDate: '2020-01-17',
            toDate: '2020-01-17',
            fund: 'ALL',
        }

        service.getTaxLotsReport(obj.toDate, obj.fromDate, obj.fund).subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/taxlotsReport?from=' + obj.fromDate + '&to=' + obj.toDate + '&fund=' + obj.fund);
        expect(request.request.method).toBe('GET');
    });
  });

  describe('Get Taxlot Report URL: /journal/taxlotReport?from=+fromDate+&to=+toDate+&symbol=+symbol+&fund=+fund+&side=+side', () => {
    it('returned taxlot report', () => {

        const obj = {
            fromDate: '2020-01-17',
            toDate: '2020-01-17',
            symbol: '',
            fund: 'ALL',
            side: false
        };

        service.getTaxLotReport(obj.fromDate, obj.toDate, obj.symbol, obj.fund, obj.side).subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/taxlotReport?from=' + obj.fromDate + '&to=' + obj.toDate + '&symbol=' + obj.symbol + '&fund=' + obj.fund + '&side=' + obj.side);
        expect(request.request.method).toBe('GET');
    });
  });

  describe('Get ClosingTaxlots Report URL: /journal/closingTaxLots?orderid=+lporderid', () => {
    it('returned closing taxlot report', () => {

        const lpOrderId = 'a9f3f7ef-7d21-4c79-82dd-f934f4be63de';

        service.getClosingTaxLots(lpOrderId).subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/closingTaxLots?orderid=' + lpOrderId);
        expect(request.request.method).toBe('GET');
    });
  });

  // DayPnl Reconcile

  describe('Get Reconcile Report URL: /journal/recon?source=daypnl&date=+date+&fund=+fund', () => {
    it('returned reconcile report', () => {

        const obj = {
            date: '2020-01-17',
            fund: 'ALL'
        }

        service.getReconReport(obj.date, obj.fund).subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/recon?source=daypnl&date=' + obj.date + '&fund=' + obj.fund);
        expect(request.request.method).toBe('GET');
    });
  });

  // Bookmon reconcile

  describe('Get Bookmon Reconcile Report URL: /journal/recon?source=exposure&date=+date +&fund=+fund', () => {
    it('returned bookmon reconcile report', () => {

        const obj = {
            date: '2020-01-17',
            fund: 'ALL'
        }

        service.getBookmonReconReport(obj.date, obj.fund).subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/recon?source=exposure&date=' + obj.date + '&fund=' + obj.fund);
        expect(request.request.method).toBe('GET');
    });
  });

  // Fund Admin Reconcile

  describe('Get FundAdmin Reconcile Report URL: /journal/recon?source=fundadmin&date=+date+&fund=+ fund', () => {
    it('returned FundAdmin reconcile report', () => {

        const obj = {
            date: '2020-01-17',
            fund: 'ALL'
        };

        service.getFundAdminReconReport(obj.date, obj.fund).subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/recon?source=fundadmin&date=' + obj.date + '&fund=' + obj.fund);
        expect(request.request.method).toBe('GET');
    });
  });

  describe('Get PeriodJournals Modal Report URL: /journal/periodJournals?symbol=+symbol+&now=+now+&period=+period', () => {
    it('returned PeriodJournals modal report', () => {
        const obj = {
            symbol: 'ACBI',
            now: '2020-01-17',
            period: 'ytd'
        };

        service.getPeriodJournals(obj.symbol, obj.now, obj.period).subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/periodJournals?symbol=' + obj.symbol + '&now=' + obj.now + '&period=' + obj.period);
        expect(request.request.method).toBe('GET');
    });
  });

  // Trailbalence

  describe('Get Trailbalence Report URL: /journal/trialBalanceReport?from=+fromDate+&to=+toDate+&fund=+fund', () => {
    it('returned Trailbalence report', () => {

        const obj = {
            fromDate: null,
            toDate: null,
            fund: 'ALL',
        };

        service.getTrialBalanceReport(null, null, 'ALL').subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });

        const request = httpTestingController.expectOne(baseUrl + '/journal/trialBalanceReport?from=' + obj.fromDate + '&to=' + obj.toDate + '&fund=' + obj.fund);
        expect(request.request.method).toBe('GET');
    });
  });

});
