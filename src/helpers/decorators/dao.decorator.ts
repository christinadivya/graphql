import { MetadataKeys } from "./metadata.keys";

const DAO = (basePath: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(MetadataKeys.BASE_PATH, basePath, target);
  };
};

export default DAO;
