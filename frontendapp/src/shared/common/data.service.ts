import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DataService {
  private oGridOptions = new BehaviorSubject(null);
  gridColumnApi = this.oGridOptions.asObservable();
  // private messageSource = new BehaviorSubject('default message');
  //currentMessage = this.messageSource.asObservable();

  constructor() {}

  changeMessage(obj: any) {
    this.oGridOptions.next(obj);

    //this.messageSource.next(message)
  }
}
