import { MetadataKeys } from "./metadata.keys";

export enum Methods {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
}
export interface IRouter {
  method: Methods;
  path: string;
  handlerName: string | symbol;
}
const methodDecoratorFactory = (method: Methods) => {
  return (path: string): MethodDecorator => {
    return (target, propertyKey) => {
      const serviceClass = target.constructor;
      const routers: IRouter[] = Reflect.hasMetadata(
        MetadataKeys.ROUTERS,
        serviceClass
      )
        ? Reflect.getMetadata(MetadataKeys.ROUTERS, serviceClass)
        : [];
      routers.push({
        method,
        path,
        handlerName: propertyKey,
      });
      Reflect.defineMetadata(MetadataKeys.ROUTERS, routers, serviceClass);
    };
  };
};

export const Get = methodDecoratorFactory(Methods.GET);
export const Post = methodDecoratorFactory(Methods.POST);
export const Put = methodDecoratorFactory(Methods.PUT);
export const Delete = methodDecoratorFactory(Methods.DELETE);
export const Patch = methodDecoratorFactory(Methods.PATCH);
