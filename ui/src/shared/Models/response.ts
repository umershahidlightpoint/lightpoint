export interface Response<T> {
  when: Date;
  by: string;
  isSuccessful: boolean;
  message: string;
  payload: T;
  meta: object;
  stats: object;
  statusCode: number;
}
