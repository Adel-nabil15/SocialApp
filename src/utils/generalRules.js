import joi from "joi";
import { Types } from "mongoose";

const idvalid = (value, helper) => {
  const isvalid = Types.ObjectId.isvalid(value);
  isvalid ? value : helper.message(`id is not match ${value}`);
};

export const GeneralRules = {
  id: joi.string().custom(idvalid),
  age: joi.number().integer().min(18).max(100).required(),

  email: joi
    .string()
    .email({
      tlds: { allow: true },
      minDomainSegments: 2,
      maxDomainSegments: 3,
    })
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

  password: joi
    .string()
    .min(8)
    .max(30)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot exceed 30 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      "any.required": "Password is required",
    }),

  name: joi
    .string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]*$/)
    .messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name cannot exceed 50 characters",
      "string.pattern.base": "Name can only contain letters and spaces",
    }),

  phone: joi
    .string()
    .pattern(/^\+?[\d\s-]{10,}$/)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),

  url: joi.string().uri().messages({
    "string.uri": "Please provide a valid URL",
  }),

  date: joi.date().iso().messages({
    "date.base": "Please provide a valid date",
    "date.format": "Date must be in ISO format",
  }),

  Headers: joi.object({
    authorization: joi.string().required(),
    host: joi.string(),
    "Cache-Control": joi.string(),
    "Postman-Token": joi.string(),
    "User-Agent": joi.string(),
    Accept: joi.string(),
    "Accept-Encoding": joi.string(),
    Connection: joi.string(),
    "Content-Type": joi.string(),
    "Content-Length": joi.string(),
  }),
};
