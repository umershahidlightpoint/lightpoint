export interface PostingEngine {
  period: string;
  Started: string;
  key: string;
  IsRunning: boolean;
}

export interface PostingEngineStatus {
  message: string;
  version: string;
  key: string;
  Status: boolean;
  progress: number;
}

export interface IsPostingEngineRunning {
  period: string;
  started: string;
  key: string;
  IsRunning: boolean;
  progress: number;
}
