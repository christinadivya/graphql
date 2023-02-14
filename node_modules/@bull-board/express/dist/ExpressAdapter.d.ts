import { AppControllerRoute, AppViewRoute, BullBoardQueues, ControllerHandlerReturnType, IServerAdapter } from '@bull-board/api/dist/typings/app';
export declare class ExpressAdapter implements IServerAdapter {
    private readonly app;
    private basePath;
    private bullBoardQueues;
    private errorHandler;
    constructor();
    setBasePath(path: string): ExpressAdapter;
    setStaticPath(staticsRoute: string, staticsPath: string): ExpressAdapter;
    setViewsPath(viewPath: string): ExpressAdapter;
    setErrorHandler(handler: (error: Error) => ControllerHandlerReturnType): this;
    setApiRoutes(routes: AppControllerRoute[]): ExpressAdapter;
    setEntryRoute(routeDef: AppViewRoute): ExpressAdapter;
    setQueues(bullBoardQueues: BullBoardQueues): ExpressAdapter;
    getRouter(): any;
}
