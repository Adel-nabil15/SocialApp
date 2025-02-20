import joi from "joi";
import { GeneralRoules } from "../../utils/generalRules.js";
import { GenderType } from "../../DB/models/user.model.js";

export const signInValiddation = {
  body: joi.object({
    email: GeneralRoules.email.required(),
    password: GeneralRoules.password.required(),
  }),
};

export const regesterValidation = {
  body: joi.object({
    name: joi.string().alphanum().min(3).required(),
    email: GeneralRoules.email.required(),
    password: GeneralRoules.password.required(),
    Cpassword: joi
      .string()
      .valid(joi.ref("password"))
      .required()
      .messages({ "any.only": "sorry password not match" }),
    phone: joi.string().min(11).max(11).required(),
    gender: joi.string().valid(GenderType.Female, GenderType.Male).required(),
  }),
  file: joi.object(),
};

export const confirmValidation = {
  body: joi.object({
    email: GeneralRoules.email.required(),
    code: GeneralRoules.password.required(),
  }),
};

export const refrechTokenValidation = {
  body: joi.object({
    authorization: joi.string().required(),
  }),
};

export const FPvalidation = {
  body: joi.object({
    email: GeneralRoules.email.required(),
  }),
};

export const reseatPasswordValidation = {
  body: joi.object({
    email: GeneralRoules.email.required(),
    code: GeneralRoules.password.required(),
    newPassword: GeneralRoules.password.required(),
    CnewPassword: joi.string().valid(joi.ref("newPassword")).required(),
  }),
};
export const updateuserValidation = {
  body: joi.object({
    name: joi.string().alphanum().min(3),
    gender: joi.string().min(11).max(11),
    phone: joi.string().min(11).max(11),
  }),
  file: joi.object(),
};

export const updatePasswordValid = {
  body: joi.object({
    oldPassword: GeneralRoules.password.required(),
    newpassword: GeneralRoules.password.required(),
    Cnewpassword: joi.string().valid(joi.ref("newpassword")).required(),
  }),
};

export const shareProfileVALID = {
  params: GeneralRoules.id.required(),
};
