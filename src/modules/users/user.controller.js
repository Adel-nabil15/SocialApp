import { Router } from "express";
import { Confirm, dashportAdmin, fixedUpdate, forgetPassword, refrechToken, reseatPassword, shareProfile, signIn, signUp, updateEmail, updatePassword, updateProfile, UpdateRole } from "./user.service.js";
import { fileType, multerHost, multerstore } from "../../middleware/multer.js";
import {  Authenticationn, Authorization } from "../../middleware/Auth.js";
import { RoleType } from "../../DB/models/user.model.js";
import { validation } from "../../middleware/validation.js";
import { confirmValidation, FPvalidation, refrechTokenValidation, regesterValidation, reseatPasswordValidation, shareProfileVALID, signInValiddation, updatePasswordValid, updateuserValidation } from "./user.validation.js";

const UserRouter = Router()
UserRouter.post("/signUp",multerHost(fileType.images).single("attachment"),validation(regesterValidation),signUp)
UserRouter.patch("/confirmed",validation(confirmValidation),Confirm)
UserRouter.post("/signIn",validation(signInValiddation),signIn)
UserRouter.get("/freshToken",validation(refrechTokenValidation),refrechToken)
UserRouter.patch("/forgetPasssword",validation(FPvalidation),forgetPassword)
UserRouter.patch("/reseatPassword",validation(reseatPasswordValidation),reseatPassword)
UserRouter.patch("/updatePassword",Authenticationn,validation(updatePasswordValid),updatePassword)
UserRouter.patch("/updateUser",Authenticationn,multerHost(fileType.images).single("attachment"),validation(updateuserValidation),updateProfile)
UserRouter.patch("/shareProfile/:id",validation(shareProfileVALID),Authenticationn,shareProfile)
UserRouter.patch("/updateEmail",Authenticationn,updateEmail)
UserRouter.patch("/fixedUpdate",Authenticationn,fixedUpdate)
UserRouter.get("/dashportAdmin",Authenticationn,Authorization([RoleType.Admin,RoleType.superAdmin]),dashportAdmin)
UserRouter.patch("/UpdateRole/:userId",Authenticationn,Authorization([RoleType.Admin,RoleType.superAdmin]),UpdateRole)

export default UserRouter 