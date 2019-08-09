import { Component, OnInit,Input ,Injector,ChangeDetectorRef,ViewChild} from '@angular/core';

import { FinancePocServiceProxy } from '../../shared/service-proxies/service-proxies';
import { GridName } from   "../../shared/utils/AppEnums"
import { ToastrService } from "ngx-toastr";
import { ModalDirective } from "ngx-bootstrap";
import { DataService } from "../../shared/common/data.service";
@Component({
  selector: 'app-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls: ['./grid-layout.component.css']
})
export class GridLayoutComponent implements OnInit {
 
 public gridLayoutID :any= 0;
 layoutName:any;
 gridLayouts :any;
 @Input("gridOptions") gridOptions: any;
  constructor(injector: Injector, private _FinanceService: FinancePocServiceProxy 
    , private toastrService: ToastrService ,private cdRef: ChangeDetectorRef,private DataService: DataService  ) {
      (injector);
      }
      @ViewChild("modal") modal: ModalDirective;
  ngOnInit() {
      this.getLayout();
    
      // this.DataService.gridColumnApi.subscribe(obj => obj = this.gridOptions)
      // this.DataService.changeMessage(this.gridOptions );
      // let dsf= this.DataService.gridColumnApi ;
  }
 


 public getLayout()
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
           
            if (e > 0){
            this.gridLayoutID = e;
            this._FinanceService.GetAGridLayout(e)
            .subscribe(response => {
              
                
              this.gridOptions.columnApi.setColumnState(JSON.parse(response.payload.ColumnState) );
              this.gridOptions.columnApi.setPivotMode(JSON.parse(response.payload.PivotMode) );
              this.gridOptions.columnApi.setColumnGroupState(JSON.parse(response.payload.GroupState) );
              this.gridOptions.api.setSortModel(JSON.parse(response.payload.SortState) );
              this.gridOptions.api.setFilterModel(JSON.parse(response.payload.FilterState) );
              
                //  let dd = response;

            });
            }
          }
          onEditSave()
                {
                  this.onSaveState(this.gridLayoutID);
                }
       public   onSaveState(gridLayout_ID) {
   
    
            let oDataGridStatusDto = {
             Id: gridLayout_ID,
             GridId:GridName.Journal,
             GridLayoutName:this.layoutName,
             UserId: 1,
             GridName: 'Journal',
             PivotMode : JSON.stringify(this.gridOptions.columnApi.isPivotMode()),
             ColumnState : JSON.stringify(this.gridOptions.columnApi.getColumnState()),
             GroupState : JSON.stringify(this.gridOptions.columnApi.getColumnGroupState()),
             SortState : JSON.stringify(this.gridOptions.api.getSortModel()),
             FilterState:  JSON.stringify( this.gridOptions.api.getFilterModel())
           };

           this._FinanceService.SaveDataGridState(oDataGridStatusDto).subscribe(
            response => {
              
              if (response.isSuccessful) {
                this.toastrService.success("Status saved successfully!");
               this. getLayout();
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
            
            this.layoutName="";
            this.modal.show(); 
            return;
        
          }
          closeModal()
          {
            this.modal.hide();
        
          }


}
