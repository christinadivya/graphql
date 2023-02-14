export default class LoggerStreamAdapter {
  static toStream(logger: { info: (arg0: any) => void }): any {
    return {
      write(message: string | any[]) {
        logger.info(message.slice(0, -1));
      },
    };
  }
}
