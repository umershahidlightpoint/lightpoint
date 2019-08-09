import { Component, OnInit,Input ,Injector,ChangeDetectorRef,ViewChild} from '@angular/core';
import {IToolPanel, IToolPanelParams} from "ag-grid-community";

import { FinancePocServiceProxy } from '../../shared/service-proxies/service-proxies';
import { GridName } from   "../../shared/utils/AppEnums"
import { ToastrService } from "ngx-toastr";
import { ModalDirective } from "ngx-bootstrap";
import { DataService } from "../../shared/common/data.service";
;
@Component({
  selector: 'app-grid-layout-menu',
  templateUrl: './grid-layout-menu.component.html',
  styleUrls: ['./grid-layout-menu.component.css']
})

export class GridLayoutMenuComponent implements IToolPanel{
  private params: IToolPanelParams;
  test:string; 
 public gridLayoutID :any;
 public gridpppppp :any;
 layoutName:any;
 canUpdateLayout: any
 isPublic: boolean = false
 isNewLayout: boolean = false

 public:boolean
 
 gridLayouts :any;
 @Input("gridOptionsss") gridOptionsss: any;
 
 constructor(injector: Injector, private _FinanceService: FinancePocServiceProxy 
  , private toastrService: ToastrService ,private cdRef: ChangeDetectorRef,
  private DataService: DataService ) {
    (injector);
    }
    @ViewChild("modal") modal: ModalDirective;
   
  agInit(params: IToolPanelParams): void {
  this.params = params;
 
  
  this.params.api.addEventListener('modelUpdated', this.getLayout.bind(this));
  this.DataService.gridColumnApi.subscribe(obj => this.gridOptionsss = obj)
  //let dsf= this.DataService.gridColumnApi ;
  }
  // ngOnChanges(){
    
  //    if (this.gridOptionsss != null)
  //    {
       
  //    }
  //   }

  callMethod(): void {
    console.log('successfully executed.');
    this.test = 'Me';
}

    getLayout():void
  {
    this._FinanceService.getGridLayouts(1,1).subscribe(result => {
      
      let gridLayout = result.payload.map(item => ({
        FundCode: item.oDataGridStatusDto,
      }));
      
      this.gridLayouts = result.payload;
      this.cdRef.detectChanges();
    });
    
  }

   
  public RestoreLayout(e)
  {
    console.log('e ==>',e)
    if (e){
    this.canUpdateLayout = e.IsPublic
    console.log('this.canUpdateLayout',this.canUpdateLayout)
    this.gridLayoutID = e;
    this._FinanceService.GetAGridLayout(e.Id)
    .subscribe(response => {
      
       
      this.gridOptionsss.columnApi.setColumnState(JSON.parse(response.payload.ColumnState) );
      this.gridOptionsss.columnApi.setPivotMode(JSON.parse(response.payload.PivotMode) );
      this.gridOptionsss.columnApi.setColumnGroupState(JSON.parse(response.payload.GroupState) );
      this.gridOptionsss.api.setSortModel(JSON.parse(response.payload.SortState) );
      this.gridOptionsss.api.setFilterModel(JSON.parse(response.payload.FilterState) );
      
        //  let dd = response;

    });
    }
  }
  onEditSave()
    {
      if(this.canUpdateLayout){
        this.toastrService.error("Public Gridlayouts are not editable!");
      }
      else {
        this.onSaveState(this.gridLayoutID);
      }      
    }
public onSaveState(gridLayout_ID) {

    console.log('isPublic',this.isPublic)
    console.log('layoutName',this.layoutName)
    

    let oDataGridStatusDto = {
     Id: gridLayout_ID.Id,
     GridId: GridName.Journal,
     GridLayoutName: this.layoutName,
     IsPublic: this.isPublic,
     UserId: 1,
     GridName: 'Journal',
     PivotMode : JSON.stringify(this.gridOptionsss.columnApi.isPivotMode()),
     ColumnState : JSON.stringify(this.gridOptionsss.columnApi.getColumnState()),
     GroupState : JSON.stringify(this.gridOptionsss.columnApi.getColumnGroupState()),
     SortState : JSON.stringify(this.gridOptionsss.api.getSortModel()),
     FilterState:  JSON.stringify( this.gridOptionsss.api.getFilterModel())
   };

   this._FinanceService.SaveDataGridState(oDataGridStatusDto).subscribe(
    response => {
      
      if (response.isSuccessful) {
        this.toastrService.success("Status saved successfully!");
        this. getLayout();
        this.isNewLayout = false
        this.closeModal();
        this.getLayout();
      } else {
        this.toastrService.error("Failed to save status!");
      }
    },
    error => {
      this.toastrService.error("Something went wrong. Try again later!");
    }
  );
  }        
   
  onNewSave()
  {
    if (this.layoutName == "")
    {
      this.toastrService.error("Please enter name");
    }

    this.onSaveState(0);
  }



  onCreateNew()
  {
    this.isNewLayout = !this.isNewLayout
    this.layoutName="";
    //this.modal.show(); 
    return;

  }
  closeModal()
  {
    this.modal.hide();

  }
 
  
  refresh(){
  
  }
  }
  