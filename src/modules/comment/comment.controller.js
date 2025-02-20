import { Router } from "express";
import { fileType, multerHost } from "../../middleware/multer.js";
import { Authenticationn } from "../../middleware/Auth.js";
import { creatComment, freazeComment, updateComment } from "./comment.service.js";
const commentRouter=Router({mergeParams:true})

commentRouter.post("/",multerHost(fileType.images).array("attachment",5),Authenticationn, creatComment)
commentRouter.patch("/:commentId",multerHost(fileType.images).array("attachment",5),Authenticationn, updateComment)
commentRouter.delete("/:commentId",multerHost(fileType.images).array("attachment",5),Authenticationn, freazeComment)


 
 

 



export default commentRouter