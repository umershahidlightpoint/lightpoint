export class CustomError extends Error {
  public code: number;

  constructor(message: string, code: number) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
  }
}
