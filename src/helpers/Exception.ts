/**
 *  Exception
 * @public
 */
export default class Exception {
  err?: Error;
  error?: Error;
  errorCode: number;
  msg: string;

  constructor(errorCode: number, msg: string, err?: Error) {
    this.errorCode = errorCode;
    this.msg = msg;
    if (err) {
      this.err = err;
    }
  }
}
