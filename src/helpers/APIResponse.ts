/**
 *  API response
 * @public
 */
class APIResponse {
  error: any;
  result: any;
  sc: boolean;
  time: number;
  constructor(sc: boolean, result: any) {
    this.sc = sc;
    if (sc) {
      this.result = result || {};
    } else {
      this.error = result || {};
    }
    this.time = new Date().getTime();
  }
}

export default APIResponse;
