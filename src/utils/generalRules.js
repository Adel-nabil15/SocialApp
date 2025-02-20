import joi from "joi";
import { Types } from "mongoose";

const idvalid = (value, helper) => {
  const isvalid = Types.ObjectId.isvalid(value);
  isvalid ? value : helper.message(`id is not match ${value}`);
};

export const GeneralRoules = {
  id: joi.string().custom(idvalid),
  email: joi
    .string()
    .email({
      tlds: { allow: true },
      minDomainSegments: 2,
      maxDomainSegments: 3,
    }),
  password: joi.string().min(4),
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
