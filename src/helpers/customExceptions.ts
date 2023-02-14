import Exception from "./Exception";

export default {
  /**
   *This function is to handle internal server error
   * @param errMsg - error message
   * @param err - error
   * @returns - exception
   */
  intrnlSrvrErr(errMsg: string, err: any): Exception {
    return new Exception(1, errMsg, err);
  },
  /**
   *This function is to handel validation error
   * @param errMsg -error message
   * @returns exception
   */
  validationError(errMsg: string): Exception {
    return new Exception(2, errMsg);
  },
  /**
   *This function is to handel unauthenticated access error
   * @param errMsg -error message
   * @param errorCode -error code
   * @returns exception
   */
  unAuthenticatedAccess(errMsg: string, errorCode: number): Exception {
    return new Exception(errorCode, errMsg);
  },
  /**
   *This function is to handle conflict error
   * @param errMsg -error message
   * @returns - exception
   */
  conflictError(errMsg: string): Exception {
    return new Exception(4, errMsg);
  },
};
