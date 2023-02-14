import Log4js from "log4js";
import config from "./config";

Log4js.configure(config);

export default Log4js.getLogger("app");
