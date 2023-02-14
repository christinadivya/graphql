import { Joi } from "express-validation";
import PasswordComplexity from "joi-password-complexity";
import i18next from "../../config/i18nextConfig";

const string = Joi.string();

const userValidation = {
  register: {
    body: Joi.object({
      first_name: string
        .trim()
        .required()
        .messages({
          "any.required": i18next.t("firstNameRequired"),
        }),
      last_name: string.trim().optional().allow("", null),
      country_code: string
        .pattern(/^[\d]*$/)
        .required()
        .messages({
          "string.pattern.base": i18next.t("invalidCountryCode"),
          "any.required": i18next.t("countryCodeRequired"),
        }),

      phone: string
        .pattern(/^[\d]*$/)
        .required()
        .messages({
          "string.pattern.base": i18next.t("invalidPhone"),
          "any.required": i18next.t("phoneRequired"),
        }),

      email: string
        .email()
        .required()
        .messages({
          "string.pattern.base": i18next.t("invalidEmail"),
          "any.required": i18next.t("emailRequired"),
        }),

      password: PasswordComplexity({
        min: 6,
        max: 20,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4,
      }),
    }),
  },
};

export default userValidation;
