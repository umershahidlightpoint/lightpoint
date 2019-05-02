export class RecordNotFoundException extends Error {
  public code: number;

  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
    this.code = 404;
  }
}
