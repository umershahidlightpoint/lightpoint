import { TestBed } from '@angular/core/testing';
import { GridLayoutApiService } from './grid-layout-api.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

fdescribe('GridLayout Service', () => {
  // We declare the variables that we'll use for the Test Controller and for our Service
  let httpTestingController: HttpTestingController;
  let service: GridLayoutApiService;
  const baseUrl = 'http://localhost:9092/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridLayoutApiService],
      imports: [HttpClientTestingModule]
    });

    // We inject our service (which imports the HttpClient) and the Test Controller
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(GridLayoutApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('A save gridLayout URL: /DataGrid', () => {
    it('return stored gridLayouts', () => {
      const obj =  {"Id":1000,"GridId":1000,"GridLayoutName":"test","IsPublic":false,"UserId":1,"GridName":"Taxlot Status","PivotMode":"false","ColumnState":"[{\"colId\":\"ag-Grid-AutoColumn\",\"hide\":false,\"aggFunc\":null,\"width\":103,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"open_id\",\"hide\":true,\"aggFunc\":null,\"width\":120,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"trade_date\",\"hide\":false,\"aggFunc\":null,\"width\":118,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"symbol\",\"hide\":false,\"aggFunc\":null,\"width\":100,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":0},{\"colId\":\"status\",\"hide\":false,\"aggFunc\":null,\"width\":93,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"side\",\"hide\":false,\"aggFunc\":null,\"width\":84,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"original_quantity\",\"hide\":false,\"aggFunc\":\"sum\",\"width\":135,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"quantity\",\"hide\":false,\"aggFunc\":\"sum\",\"width\":136,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null},{\"colId\":\"investment_at_cost\",\"hide\":false,\"aggFunc\":null,\"width\":161,\"pivotIndex\":null,\"pinned\":null,\"rowGroupIndex\":null}]","GroupState":"[]","SortState":"[]","FilterState":"{}","ExternalFilterState":"{\"fundFilter\":\"All Funds\",\"symbolFilter\":\"\",\"dateFilter\":{\"startDate\":\"2020-01-17\",\"endDate\":\"2020-01-17\"}}"}

      service.saveDataGridState(obj).subscribe(response => {
    expect(response.statusCode).toEqual(200);
    });

      const request = httpTestingController.expectOne(baseUrl + '/DataGrid');
      expect(request.request.method).toBe('POST');
    });
    });

  describe('Get All GridLayouts URL: DataGrid/GetGridLayouts', () => {
    it('return gridLayouts', () => {

        service.getAllGridLayouts().subscribe(response => {
        expect(response.statusCode).toEqual(200);
    });
        const request = httpTestingController.expectOne(baseUrl + '/DataGrid/GetGridLayouts');
        expect(request.request.method).toBe('GET');
    });
  });

  describe('Get GridLayouts URL: /DataGrid/GetDataGridLayouts?gridId=14&userId=1', () => {
    it('return gridlayout', () => {

     const obj = {
        gridId : 1000,
        userId: 1
     };

     service.getGridLayouts(obj.gridId, obj.userId).subscribe(settings => {
    expect(settings.statusCode).toEqual(200);
    });

     const request = httpTestingController.expectOne(baseUrl + '/DataGrid/GetDataGridLayouts?gridId=' + obj.gridId + '&userId=' + obj.userId);
     expect(request.request.method).toBe('GET');
    });
    });


  describe('Get a single stored gridLayouts URL: /DataGrid/GetAGridLayout?id= + id', () => {
    it('return stored gridLayouts', () => {
    const gridId = 1000;
    service.GetAGridLayout(gridId).subscribe(gridLayout => {
    expect(gridLayout.statusCode).toEqual(200);
    });

    const request = httpTestingController.expectOne(baseUrl + '/DataGrid/GetAGridLayout?id=' + gridId);
    expect(request.request.method).toBe('GET');
    });
    });

  describe('Delete a gridLayout URL: /DataGrid/ + id', () => {
        it('return stored gridLayouts', () => {
        const gridId = 1000;
        service.deleteGridLayout(gridId).subscribe(gridLayout => {
        expect(gridLayout.statusCode).toEqual(200);
        });

        const request = httpTestingController.expectOne(baseUrl + '/DataGrid/' + gridId);
        expect(request.request.method).toBe('DELETE');
        });
        });

});
