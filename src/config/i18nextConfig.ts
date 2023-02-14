import i18next from "i18next";
import Backend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import { join } from "path";

i18next
  .use(middleware.LanguageDetector)
  .use(Backend)
  .init({
    detection: { lookupHeader: "app-language" },
    debug: false,
    backend: {
      addPath: join(__dirname, "./locales/{{lng}}/{{ns}}.missing.json"),
      loadPath: join(__dirname, "./locales/{{lng}}/{{ns}}.json"),
    },
    ns: ["translation"],
    fallbackLng: ["en"],
    preload: ["en"],
  });

export default i18next;
