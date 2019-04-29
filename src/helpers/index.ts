export class Helper {
  public success(
    code: number,
    message: string,
    data: Array<object>,
    meta: object
  ): object {
    return data instanceof Array
      ? {
          code: code || null,
          message: message || null,
          data: data || null,
          meta: meta || null
        }
      : {
          code: code || null,
          message: message || null,
          data: data || null
        };
  }

  public error(code: number, message: string): object {
    return {
      code: code || null,
      message: message || null
    };
  }
}
