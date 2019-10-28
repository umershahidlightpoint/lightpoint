export interface GridLayout {
  ColumnState: Array<any>;
  ExternalFilterState: Array<any>;
  FilterState: Array<any>;
  GridId: number;
  GridLayoutName: string;
  GridName: string;
  GroupState: Array<any>;
  Id: number;
  IsPublic: boolean;
  PivotMode: Array<any>;
  SortState: Array<any>;
  UserId: number;
}

export interface MonthlyPerformanceData {
  id: number;
  rowId: number;
  modified: boolean;
  estimated: boolean;
  year: number;
  month: string;
  fund: string;
  portfolio: string;
  monthEndNav: number;
  startOfMonthEstimateNav: number;
  performance: number;
  mtd: number;
  ytdNetPerformance: number;
  qtd: number;
  ytd: number;
  itd: number;
  createdBy: string;
  lastUpdatedBy: string;
  createdDate: string;
  lastUpdatedDate: string;
}

export interface TaxRateData {
  id: number;
  effectiveFrom: string;
  effectiveTo: string;
  longTermTaxRate: number;
  shortTermTaxRate: number;
  shortTermPeriod: number;
  createdBy: string;
  lastUpdatedBy: string;
  createdDate: string;
  lastUpdatedDate: string;
}
