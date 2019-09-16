export interface File {
  id: number;
  name: string;
  path: string;
  source: string;
  statistics: number;
  fileActionId: number;
  action: string;
  startDate: string;
  endDate: string;
}
